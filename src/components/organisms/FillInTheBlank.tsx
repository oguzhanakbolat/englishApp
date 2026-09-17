import { Fonts } from "@/constants/fonts";
import { ExerciseType, QuestionType } from "@/data";
import { useTheme } from "@/hooks/use-theme";
import pointCalculator, { PointCalculatorType } from "@/utils/pointCalculator";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
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
import Point from "./Point";

const width = Dimensions.get("window").width;

type FillInTheBlankType = {
  exercise: ExerciseType;
  level: number;
  lesson: number;
};

const FillInTheBlank: FC<FillInTheBlankType> = ({
  exercise,
  level,
  lesson,
}) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const router = useRouter();
  const [newExercise, setNewExercise] = useState<ExerciseType | null>(
    {} as ExerciseType,
  );
  const [selected, setSelected] = useState<string | null>();
  const [correct, setCorrect] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);
  const [points, setPoints] = useState<PointCalculatorType | null>(null);
  const [answer, setAnswer] = useState<any>();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const correctAudio = useAudioPlayer(require("@/constants/correct.mp3"));
  const wrongAudio = useAudioPlayer(require("@/constants/wrong.mp3"));

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // Sesi güvenli şekilde baştan çal: önce pause, seekTo'yu bekle, sonra play.
  // Bu, "bitmiş player play etmiyor" ve "seek tamamlanmadan play" sorunlarını
  // engeller. Ayrıca hata durumunda uygulamayı kırmaz.
  const playSafely = async (player: AudioPlayer, label: string) => {
    try {
      if (!player) {
        console.warn(`[audio] ${label}: player yok`);
        return;
      }
      if (player.playing) {
        player.pause();
      }
      await player.seekTo(0);
      if (!isMountedRef.current) return;
      player.play();
    } catch (err) {
      console.warn(`[audio] ${label} çalınırken hata:`, err);
    }
  };

  const handleAnswer = (answer: string, answerText: string) => {
    if (answer === newExercise?.questions?.[active]?.isCorrect) {
      const newAnswer = {
        id: newExercise?.questions?.[active]?.id,
        questionId: newExercise?.questions?.[active]?.id,
        answer: answer,
        correct: true,
        error: false,
      };
      setAnswer((x: any) => [...(x ?? []), newAnswer]);
    } else {
      const newAnswer = {
        id: newExercise?.questions?.[active]?.id,
        questionId: newExercise?.questions?.[active]?.id,
        answer: answer,
        correct: false,
        error: true,
      };
      setAnswer((x: any) => [...(x ?? []), newAnswer]);
    }
    setSelectedAnswer(answerText);
    setSelected(answer);
    setCorrect(null);
    setError(null);

    const t1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setSelected(null);

      if (answer === newExercise?.questions?.[active]?.isCorrect) {
        playSafely(correctAudio, "correct");
        setCorrect(answer);
        setError(null);
      } else {
        playSafely(wrongAudio, "wrong");
        setError(answer);
        setCorrect(newExercise?.questions?.[active]?.isCorrect ?? null);

        if (active !== (newExercise?.questions?.length ?? 0) - 1) {
          const newList = { ...newExercise };
          newList?.questions?.push(
            newExercise?.questions?.[active] ?? ({} as QuestionType),
          );
          setNewExercise(newList as ExerciseType);
        }
      }
    }, 1500);

    const t2 = setTimeout(() => {
      if (!isMountedRef.current) return;
      next();
    }, 3000);

    timeoutsRef.current.push(t1, t2);
  };

  const next = () => {
    if (active === (newExercise?.questions?.length ?? 0) - 1) {
      setPoints(pointCalculator(newExercise as ExerciseType, active));
      setFinished(true);
    } else {
      const activeIndex = active + 1;
      setActive(activeIndex);
      setSelected(null);
      setSelectedAnswer(null);
      setCorrect(null);
      setError(null);
    }
  };

  const handleBack = () => {
    setFinished(false);
    setSelected(null);
    setSelectedAnswer(null);
    setCorrect(null);
    setError(null);
    setActive(0);
    setNewExercise(exercise);
  };

  const handleNext = () => {
    setFinished(false);
    setSelected(null);
    setSelectedAnswer(null);
    setCorrect(null);
    setError(null);
    setActive(0);
    router.push(`/level/${level}`);
  };

  useEffect(() => {
    setNewExercise(exercise);
  }, [exercise]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.descriptionText}>{exercise?.description}</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {newExercise?.questions?.[active].question[0]}
            {selectedAnswer ? (
              <Text style={styles.selectedAnswerText}>
                {" " + selectedAnswer + " "}{" "}
              </Text>
            ) : (
              " ........... "
            )}
            {newExercise?.questions?.[active].question[1]}
          </Text>
        </View>

        <View style={styles.answersContainer}>
          {newExercise?.questions?.[active].a && (
            <TouchableOpacity
              style={[
                styles.answer,
                selected === "a" && { backgroundColor: theme.quaternary },
                correct === "a" && { backgroundColor: theme.success },
                error === "a" && { backgroundColor: theme.primary },
              ]}
              onPress={() =>
                handleAnswer("a", newExercise?.questions?.[active]?.a ?? "")
              }
            >
              <Text style={styles.answerText}>
                {newExercise?.questions?.[active].a}
              </Text>
            </TouchableOpacity>
          )}

          {newExercise?.questions?.[active].b && (
            <TouchableOpacity
              style={[
                styles.answer,
                selected === "b" && { backgroundColor: theme.quaternary_70 },
                correct === "b" && { backgroundColor: theme.success_70 },
                error === "b" && { backgroundColor: theme.primary_70 },
              ]}
              onPress={() =>
                handleAnswer("b", newExercise?.questions?.[active]?.b ?? "")
              }
            >
              <Text style={styles.answerText}>
                {newExercise?.questions?.[active].b}
              </Text>
            </TouchableOpacity>
          )}

          {newExercise?.questions?.[active].c && (
            <TouchableOpacity
              style={[
                styles.answer,
                selected === "c" && { backgroundColor: theme.quaternary_70 },
                correct === "c" && { backgroundColor: theme.success_70 },
                error === "c" && { backgroundColor: theme.primary_70 },
              ]}
              onPress={() =>
                handleAnswer("c", newExercise?.questions?.[active]?.c ?? "")
              }
            >
              <Text style={styles.answerText}>
                {newExercise?.questions?.[active].c}
              </Text>
            </TouchableOpacity>
          )}

          {newExercise?.questions?.[active].d && (
            <TouchableOpacity
              style={[
                styles.answer,
                selected === "d" && { backgroundColor: theme.quaternary_70 },
                correct === "d" && { backgroundColor: theme.success_70 },
                error === "d" && { backgroundColor: theme.primary_70 },
              ]}
              onPress={() =>
                handleAnswer("d", newExercise?.questions?.[active]?.d ?? "")
              }
            >
              <Text style={styles.answerText}>
                {newExercise?.questions?.[active].d}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Point
        visible={finished}
        points={points ?? { points: 0, totalPoints: 0, percentage: 0 }}
        onBack={handleBack}
        onNext={handleNext}
      />
    </View>
  );
};

export default FillInTheBlank;
const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: width - 32,
      gap: 16,
      paddingBottom: (inset.bottom ?? 0) + 16,
    },
    content: {
      flex: 1,
      gap: 16,
    },
    answersContainer: {
      gap: 16,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
    answer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: theme.secondary,
      paddingVertical: 12,
    },
    answerText: {
      ...Fonts.S14W500,
      color: theme.white,
      paddingHorizontal: 16,
    },
    questionText: {
      ...Fonts.S14W500,
      color: theme.text,
      paddingVertical: 16,
      paddingHorizontal: 12,
    },
    descriptionText: {
      ...Fonts.S14W400,
      color: theme.text,
    },
    questionContainer: {
      borderRadius: 16,
      marginTop: 32,
      marginBottom: 32,
      justifyContent: "center",
      minHeight: 56,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nextButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    nextButtonText: {
      ...Fonts.S14W500,
      color: theme.white,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    progressBar: {
      width: width - 140,
      height: 12,
      backgroundColor: theme.primary_30,
      borderRadius: 12,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 12,
      backgroundColor: theme.primary,
      borderRadius: 12,
    },
    point: {
      ...Fonts.S14W500,
      color: theme.primary,
    },
    selectedAnswerText: {
      ...Fonts.S14W500,
      color: theme.secondary,
      textAlign: "center",
      minWidth: 100,
    },
  });
