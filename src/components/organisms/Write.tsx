import { Fonts } from "@/constants/fonts";
import { ExerciseType, QuestionType } from "@/data";
import { useTheme } from "@/hooks/use-theme";
import pointCalculator, { PointCalculatorType } from "@/utils/pointCalculator";
import { MaterialIcons } from "@expo/vector-icons";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Insets,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Point from "./Point";

const width = Dimensions.get("window").width;

type WriteType = {
  exercise: ExerciseType;
  level: number;
  lesson: number;
};

const normalizeAnswer = (s: string) =>
  s
    .replace(/[\u2018\u2019\u02BC\u02B9]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .trim()
    .replace(/[.,!?;:'"`)\]…]+$/u, "")
    .toLowerCase();

const Write: FC<WriteType> = ({ exercise, level, lesson }) => {
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

  const handleAnswer = () => {
    if (selectedAnswer != null || !selected?.trim()) return;

    setSelectedAnswer(selected ?? "");
    setSelected(null);
    setCorrect(null);
    setError(null);

    const answer = (
      newExercise?.questions?.[active]?.answer as string[]
    ).findIndex(
      (x: string) => normalizeAnswer(x) === normalizeAnswer(selected ?? ""),
    );

    if (answer > -1) {
      const newAnswer = {
        id: newExercise?.questions?.[active]?.id,
        questionId: newExercise?.questions?.[active]?.id,
        answer: answer,
        correct: true,
        error: false,
      };
      setAnswer((x: any) => [...(x ?? []), newAnswer]);
      playSafely(correctAudio, "correct");
      setCorrect(selected ?? null);
      setError(null);
    } else {
      const newAnswer = {
        id: newExercise?.questions?.[active]?.id,
        questionId: newExercise?.questions?.[active]?.id,
        answer: answer,
        correct: false,
        error: true,
      };
      setAnswer((x: any) => [...(x ?? []), newAnswer]);
      playSafely(wrongAudio, "wrong");
      setError(selected ?? null);
      setCorrect(
        (newExercise?.questions?.[active]?.answer as string[])[0] ?? null,
      );

      if (active !== (newExercise?.questions?.length ?? 0) - 1) {
        const newList = { ...newExercise };
        newList?.questions?.push(
          newExercise?.questions?.[active] ?? ({} as QuestionType),
        );
        setNewExercise(newList as ExerciseType);
      }
    }

    const t2 = setTimeout(() => {
      if (!isMountedRef.current) return;
      next();
    }, 2000);

    timeoutsRef.current.push(t2);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.descriptionText}>{exercise?.description}</Text>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {newExercise?.questions?.[active].question}
            </Text>
          </View>

          {selectedAnswer && (
            <>
              {error ? (
                <>
                  <View
                    style={[
                      styles.selectedAnswerContainer,
                      {
                        backgroundColor: theme.primary,
                      },
                    ]}
                  >
                    <Text style={styles.selectedAnswerText}>{error}</Text>
                  </View>
                  <View
                    style={[
                      styles.selectedAnswerContainer,
                      {
                        backgroundColor: theme.warning,
                      },
                    ]}
                  >
                    <Text style={styles.selectedAnswerText}>
                      {newExercise?.questions?.[active]?.answer?.[0]}
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={[
                    styles.selectedAnswerContainer,
                    {
                      backgroundColor: correct ? theme.success : theme.primary,
                    },
                  ]}
                >
                  <Text style={styles.selectedAnswerText}>
                    {selectedAnswer}
                  </Text>
                </View>
              )}
            </>
          )}

          <View style={styles.answersContainer}>
            <TextInput
              style={styles.answerInput}
              placeholder="Cevabınızı giriniz"
              value={selected ?? ""}
              onChangeText={setSelected}
              onSubmitEditing={handleAnswer}
              returnKeyType="done"
              enablesReturnKeyAutomatically
              editable={selectedAnswer == null}
            />
            <TouchableOpacity
              style={styles.answerButton}
              onPress={handleAnswer}
            >
              <MaterialIcons
                name="navigate-next"
                size={24}
                color={theme.white}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Point
          visible={finished}
          points={points ?? { points: 0, totalPoints: 0, percentage: 0 }}
          onBack={handleBack}
          onNext={handleNext}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Write;
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
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 8,
      overflow: "hidden",
    },
    answerInput: {
      ...Fonts.S14W500,
      color: theme.text,
      width: width - 36 - 46,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    answerButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 12,
      justifyContent: "center",
      alignItems: "center",
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
      textAlign: "center",
    },
    descriptionText: {
      ...Fonts.S14W400,
      color: theme.text,
    },
    questionContainer: {
      backgroundColor: theme.text_20,
      borderRadius: 16,
      marginTop: 32,
      marginBottom: 32,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 56,
    },
    selectedAnswerContainer: {
      backgroundColor: theme.text_20,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    selectedAnswerText: {
      ...Fonts.S14W500,
      color: theme.white,
    },
  });
