import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { useUserStore } from "@/stores/useUserStore";
import { AnswerType, ExerciseType, UserType } from "@/types";
import pointCalculator, { PointCalculatorType } from "@/utils/pointCalculator";
import { speechSimilarity } from "@/utils/speechMatch";
import { getSpeechRecognition } from "@/utils/speechRecognition";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { AudioPlayer, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useRouter } from "expo-router";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Insets,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import Point from "./Point";
import ProgressBar from "./ProgressBar";

const { width } = Dimensions.get("window");
const SUCCESS_RATE = 70;
const MAX_ATTEMPTS = 3;

type SpeakQuestion = {
  id: number;
  text: string;
  start: number;
  end: number;
};

type ListenAndSpeakType = {
  exercise: ExerciseType;
  level: number;
  lesson: number;
  audioUri?: string | null;
};

const parseClock = (value?: string) => {
  if (!value) return 0;
  const parts = value.split(":").map(Number);
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
};

const toSpeakQuestions = (exercise: ExerciseType): SpeakQuestion[] =>
  (exercise.questions ?? [])
    .map((question, index) => ({
      id: question.id ?? index + 1,
      text: String(question.text ?? question.question ?? "").trim(),
      start: parseClock(question.starttime),
      end: parseClock(question.endtime),
    }))
    .filter((question) => question.text.length > 0);

const ListenAndSpeak: FC<ListenAndSpeakType> = ({
  exercise,
  level,
  lesson,
  audioUri,
}) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const router = useRouter();
  const { user } = useUserStore();

  const questions = useMemo(() => toSpeakQuestions(exercise), [exercise]);
  const [active, setActive] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState<
    "idle" | "playing" | "listening" | "result"
  >("idle");
  const [heard, setHeard] = useState("");
  const [match, setMatch] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [finished, setFinished] = useState(false);
  const [points, setPoints] = useState<PointCalculatorType | null>(null);
  const speech = useMemo(() => getSpeechRecognition(), []);

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const correctAudio = useAudioPlayer(require("@/constants/correct.mp3"));
  const wrongAudio = useAudioPlayer(require("@/constants/wrong.mp3"));

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = useRef(true);
  const activeRef = useRef(0);
  const attemptsRef = useRef(0);
  const answersRef = useRef<AnswerType[]>([]);
  const evaluatingRef = useRef(false);
  const phaseRef = useRef<"idle" | "playing" | "listening" | "result">("idle");

  const current = questions[active];
  const currentTime = status.currentTime ?? 0;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!audioUri) return;
    player.replace({ uri: audioUri });
  }, [audioUri]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      speech?.ExpoSpeechRecognitionModule.abort();
      if (player.playing) player.pause();
    };
  }, []);

  const playSafely = async (sfx: AudioPlayer, label: string) => {
    try {
      if (sfx.playing) sfx.pause();
      await sfx.seekTo(0);
      if (!isMountedRef.current) return;
      sfx.play();
    } catch (error) {
      console.warn(`[audio] ${label}:`, error);
    }
  };

  const stopClip = () => {
    if (player.playing) player.pause();
    if (phaseRef.current === "playing") {
      phaseRef.current = "idle";
      setPhase("idle");
    }
  };

  const playClip = async () => {
    if (!audioUri || !current || phase === "listening" || phase === "result") {
      return;
    }
    speech?.ExpoSpeechRecognitionModule.abort();
    setHeard("");
    setMatch(null);
    setIsSuccess(null);
    try {
      if (player.playing) player.pause();
      await player.seekTo(current.start);
      if (!isMountedRef.current) return;
      player.play();
      phaseRef.current = "playing";
      setPhase("playing");
    } catch (error) {
      console.warn("[audio] clip:", error);
      Toast.error("Ses çalınamadı");
    }
  };

  useEffect(() => {
    if (phase !== "playing" || !current) return;
    if (currentTime >= current.end - 0.04) {
      stopClip();
    }
  }, [currentTime, current, phase]);

  const goNext = (list: AnswerType[]) => {
    const nextIndex = activeRef.current + 1;
    if (nextIndex >= questions.length) {
      setPoints(
        pointCalculator(list, level, lesson, exercise.id, user as UserType),
      );
      setFinished(true);
      return;
    }
    setActive(nextIndex);
    setAttempts(0);
    attemptsRef.current = 0;
    setHeard("");
    setMatch(null);
    setIsSuccess(null);
    phaseRef.current = "idle";
    setPhase("idle");
  };

  const finishAttempt = (spoken: string) => {
    const question = questions[activeRef.current];
    if (!question || evaluatingRef.current) return;
    evaluatingRef.current = true;

    const percent = speechSimilarity(question.text, spoken);
    const success = percent >= SUCCESS_RATE;
    const nextAttempts = success
      ? attemptsRef.current
      : attemptsRef.current + 1;
    attemptsRef.current = nextAttempts;
    setAttempts(nextAttempts);
    setHeard(spoken);
    setMatch(percent);
    setIsSuccess(success);
    phaseRef.current = "result";
    setPhase("result");

    const record: AnswerType = {
      id: answersRef.current.length + 1,
      questionId: question.id,
      answer: spoken,
      correct: success,
      error: !success,
    };
    const nextAnswers = [...answersRef.current, record];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    void playSafely(
      success ? correctAudio : wrongAudio,
      success ? "correct" : "wrong",
    );

    const shouldPass = success || nextAttempts >= MAX_ATTEMPTS;
    const t = setTimeout(() => {
      if (!isMountedRef.current) return;
      evaluatingRef.current = false;
      if (shouldPass) {
        goNext(nextAnswers);
      } else {
        phaseRef.current = "idle";
        setPhase("idle");
      }
    }, 1600);
    timeoutsRef.current.push(t);
  };

  const finishAttemptRef = useRef(finishAttempt);
  finishAttemptRef.current = finishAttempt;

  useEffect(() => {
    if (!speech) return;
    const mod = speech.ExpoSpeechRecognitionModule;
    const resultSub = mod.addListener("result", (event) => {
      const transcript = event.results?.[0]?.transcript?.trim() ?? "";
      if (!transcript) return;
      setHeard(transcript);
      if (event.isFinal) {
        mod.stop();
        finishAttemptRef.current(transcript);
      }
    });
    const errorSub = mod.addListener("error", (event) => {
      if (!isMountedRef.current) return;
      phaseRef.current = "idle";
      setPhase("idle");
      evaluatingRef.current = false;
      if (event.error === "aborted" || event.error === "no-speech") return;
      Toast.error("Konuşma algılanamadı, tekrar dene");
    });
    const endSub = mod.addListener("end", () => {
      if (!isMountedRef.current) return;
      if (phaseRef.current === "listening" && !evaluatingRef.current) {
        phaseRef.current = "idle";
        setPhase("idle");
      }
    });

    return () => {
      resultSub.remove();
      errorSub.remove();
      endSub.remove();
    };
  }, [speech]);

  const startSpeaking = async () => {
    if (!current || phase === "playing" || phase === "result") return;
    stopClip();
    setHeard("");
    setMatch(null);
    setIsSuccess(null);

    if (!speech) {
      Toast.error(
        "Mikrofon Expo Go'da çalışmaz. Native uygulmayı (APK / development build) aç.",
      );
      return;
    }

    const permission =
      await speech.ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      Toast.error("Mikrofon ve konuşma tanıma izni gerekli");
      return;
    }

    evaluatingRef.current = false;
    phaseRef.current = "listening";
    setPhase("listening");
    speech.ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
      addsPunctuation: false,
    });
  };

  const handleBack = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    speech?.ExpoSpeechRecognitionModule.abort();
    stopClip();
    answersRef.current = [];
    attemptsRef.current = 0;
    evaluatingRef.current = false;
    setFinished(false);
    setAnswers([]);
    setActive(0);
    setAttempts(0);
    setHeard("");
    setMatch(null);
    setIsSuccess(null);
    phaseRef.current = "idle";
    setPhase("idle");
    setPoints(null);
  };

  const handleNext = () => {
    handleBack();
    router.push(`/cource/${level}-${lesson}`);
  };

  if (!current) {
    return (
      <View style={styles.container}>
        <Text style={styles.hint}>Bu egzersizde cümle bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressBar active={active} questions={questions.length} />

      <Text style={styles.title}>Dinle ve tekrarla</Text>
      <Text style={styles.hint}>Cümleyi dinle, sonra aynı şekilde söyle.</Text>

      <View style={styles.card}>
        <Text style={styles.sentence}>{current.text}</Text>
      </View>

      {false && heard ? (
        <View
          style={[
            styles.resultCard,
            isSuccess === true && { backgroundColor: theme.success_20 },
            isSuccess === false && { backgroundColor: theme.danger_20 },
          ]}
        >
          <Text style={styles.heardLabel}>Senin söylediğin</Text>
          <Text style={styles.heardText}>{heard}</Text>
          {match !== null && (
            <Text
              style={[
                styles.matchText,
                { color: isSuccess ? theme.success : theme.danger },
              ]}
            >
              %{match} {isSuccess ? "Başarılı" : "Başarısız"}
            </Text>
          )}
        </View>
      ) : false ? (
        <View style={styles.placeholder} />
      ) : null}
      {false && (
        <View style={styles.attemptsRow}>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.attemptDot,
                index < attempts && { backgroundColor: theme.danger },
              ]}
            />
          ))}
          <Text style={styles.attemptLabel}>
            {attempts}/{MAX_ATTEMPTS} hatalı hak
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            phase === "playing" && { backgroundColor: theme.secondary },
          ]}
          onPress={playClip}
          disabled={phase === "listening" || phase === "result" || !audioUri}
        >
          <FontAwesome5
            name={phase === "playing" ? "pause" : "play"}
            size={22}
            color={theme.white}
          />
          <Text style={styles.actionText}>
            {phase === "playing" ? "Çalıyor" : "Dinle"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.primary },
            phase === "listening" && { backgroundColor: theme.tertiary },
          ]}
          onPress={startSpeaking}
          disabled={phase === "playing" || phase === "result"}
        >
          <Feather name="mic" size={24} color={theme.white} />
          <Text style={styles.actionText}>
            {phase === "listening" ? "Dinleniyor..." : "Konuş"}
          </Text>
        </TouchableOpacity>
      </View>

      <Point
        visible={finished}
        points={points ?? { points: 0, percentage: 0 }}
        onBack={handleBack}
        onNext={handleNext}
        type="exercises"
      />
    </View>
  );
};

export default ListenAndSpeak;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: width - 32,
      paddingBottom: (inset.bottom ?? 0) + 16,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    progressText: {
      ...Fonts.S14W600,
      color: theme.text,
      minWidth: 52,
    },
    progressTrack: {
      flex: 1,
      height: 10,
      borderRadius: 10,
      backgroundColor: theme.primary_20,
      overflow: "hidden",
    },
    progressFill: {
      height: 10,
      backgroundColor: theme.primary,
    },
    title: {
      ...Fonts.S18W600,
      color: theme.text,
      marginBottom: 6,
    },
    hint: {
      ...Fonts.S12W400,
      color: theme.text_50,
      marginBottom: 16,
    },
    card: {
      minHeight: 120,
      borderRadius: 16,
      backgroundColor: theme.secondary_10,
      justifyContent: "center",
      padding: 20,
      marginVertical: 16,
    },
    sentence: {
      ...Fonts.S16W600,
      color: theme.text,
      textAlign: "center",
      lineHeight: 28,
    },
    resultCard: {
      borderRadius: 12,
      backgroundColor: theme.primary_10,
      padding: 12,
      marginBottom: 16,
      minHeight: 84,
    },
    placeholder: {
      minHeight: 84,
      marginBottom: 16,
    },
    heardLabel: {
      ...Fonts.S12W400,
      color: theme.text_50,
      marginBottom: 4,
    },
    heardText: {
      ...Fonts.S14W500,
      color: theme.text,
    },
    matchText: {
      ...Fonts.S14W600,
      marginTop: 8,
    },
    attemptsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 24,
    },
    attemptDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.text_20,
    },
    attemptLabel: {
      ...Fonts.S12W400,
      color: theme.text_50,
      marginLeft: 4,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      marginTop: "auto",
    },
    actionButton: {
      flex: 1,
      height: 72,
      borderRadius: 16,
      backgroundColor: theme.secondary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },
    actionText: {
      ...Fonts.S16W600,
      color: theme.white,
    },
  });
