import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { useUserStore } from "@/stores/useUserStore";
import { AnswerType, ExerciseType, UserType } from "@/types";
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
import ProgressBar from "./ProgressBar";

const width = Dimensions.get("window").width;

type MultiChooseType = {
  exercise: ExerciseType;
  level: number;
  lesson: number;
};

const cloneExercise = (source: ExerciseType): ExerciseType => ({
  ...source,
  questions: source.questions?.map((question) => ({ ...question })),
  text: source.text?.map((item) => ({ ...item })),
});

const MultiChoose: FC<MultiChooseType> = ({ exercise, level, lesson }) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { user } = useUserStore();
  const router = useRouter();
  const [newExercise, setNewExercise] = useState<ExerciseType>(() =>
    cloneExercise(exercise),
  );
  const [selected, setSelected] = useState<string | null>();
  const [correct, setCorrect] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);
  const [points, setPoints] = useState<PointCalculatorType | null>(null);
  const [answer, setAnswer] = useState<AnswerType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const correctAudio = useAudioPlayer(require("@/constants/correct.mp3"));
  const wrongAudio = useAudioPlayer(require("@/constants/wrong.mp3"));

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = useRef(true);

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

  const handleAnswer = (ans: string) => {
    if (isLoading) return;
    setIsLoading(true);
    const newAnswer = {
      id: answer?.length + 1,
      questionId: newExercise?.questions?.[active]?.id,
      answer: ans,
      correct: ans === newExercise?.questions?.[active]?.isCorrect,
      error: ans !== newExercise?.questions?.[active]?.isCorrect,
    };

    const newAnswerList = [...(answer ?? []), newAnswer];

    setAnswer(newAnswerList as AnswerType[]);
    setSelected(ans);
    setCorrect(null);
    setError(null);

    const t1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setSelected(null);

      if (ans === newExercise?.questions?.[active]?.isCorrect) {
        playSafely(correctAudio, "correct");
        setCorrect(ans);
        setError(null);
      } else {
        playSafely(wrongAudio, "wrong");
        setError(ans);
        setCorrect(newExercise?.questions?.[active]?.isCorrect ?? null);

        if (active !== (newExercise?.questions?.length ?? 0) - 1) {
          setNewExercise((prev) => {
            const current = prev.questions?.[active];
            if (!current) return prev;
            return {
              ...prev,
              questions: [...(prev.questions ?? []), { ...current }],
            };
          });
        }
      }
    }, 1500);

    const t2 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setIsLoading(false);
      next(newAnswerList as AnswerType[]);
    }, 3000);

    timeoutsRef.current.push(t1, t2);
  };

  const next = (answer: AnswerType[]) => {
    if (active === (newExercise?.questions?.length ?? 0) - 1) {
      setPoints(
        pointCalculator(answer, level, lesson, exercise.id, user as UserType),
      );
      setTimeout(() => {
        setFinished(true);
      }, 100);
    } else {
      const activeIndex = active + 1;
      setActive(activeIndex);
      setSelected(null);
      setCorrect(null);
      setError(null);
    }
  };

  const handleBack = () => {
    setFinished(false);
    setAnswer([]);
    setSelected(null);
    setCorrect(null);
    setError(null);
    setActive(0);
    setNewExercise(cloneExercise(exercise));
  };

  const handleNext = () => {
    setFinished(false);
    setSelected(null);
    setCorrect(null);
    setError(null);
    setActive(0);
    router.push(`/cource/${level}-${lesson}`);
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProgressBar
          active={active}
          questions={newExercise?.questions?.length ?? 0}
        />
        <Text style={styles.descriptionText}>{exercise?.description}</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {newExercise?.questions?.[active].question}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.answer,
            selected === "a" && { backgroundColor: theme.quaternary_70 },
            correct === "a" && { backgroundColor: theme.success_70 },
            error === "a" && { backgroundColor: theme.primary_70 },
          ]}
          onPress={() => handleAnswer("a")}
        >
          <View
            style={[
              styles.answerIcon,
              selected === "a" && { backgroundColor: theme.quaternary },
              correct === "a" && { backgroundColor: theme.success },
              error === "a" && { backgroundColor: theme.primary },
            ]}
          >
            <Text style={styles.answerIconText}>A</Text>
          </View>

          <Text style={styles.answerText}>
            {newExercise?.questions?.[active].a}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.answer,
            selected === "b" && { backgroundColor: theme.quaternary_70 },
            correct === "b" && { backgroundColor: theme.success_70 },
            error === "b" && { backgroundColor: theme.primary_70 },
          ]}
          onPress={() => handleAnswer("b")}
        >
          <View
            style={[
              styles.answerIcon,
              selected === "b" && { backgroundColor: theme.quaternary },
              correct === "b" && { backgroundColor: theme.success },
              error === "b" && { backgroundColor: theme.primary },
            ]}
          >
            <Text style={styles.answerIconText}>B</Text>
          </View>

          <Text style={styles.answerText}>
            {newExercise?.questions?.[active].b}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.answer,
            selected === "c" && { backgroundColor: theme.quaternary_70 },
            correct === "c" && { backgroundColor: theme.success_70 },
            error === "c" && { backgroundColor: theme.primary_70 },
          ]}
          onPress={() => handleAnswer("c")}
        >
          <View
            style={[
              styles.answerIcon,
              selected === "c" && { backgroundColor: theme.quaternary },
              correct === "c" && { backgroundColor: theme.success },
              error === "c" && { backgroundColor: theme.primary },
            ]}
          >
            <Text style={styles.answerIconText}>C</Text>
          </View>
          <Text style={styles.answerText}>
            {newExercise?.questions?.[active].c}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.answer,
            selected === "d" && { backgroundColor: theme.quaternary_70 },
            correct === "d" && { backgroundColor: theme.success_70 },
            error === "d" && { backgroundColor: theme.primary_70 },
          ]}
          onPress={() => handleAnswer("d")}
        >
          <View
            style={[
              styles.answerIcon,
              selected === "d" && { backgroundColor: theme.quaternary },
              correct === "d" && { backgroundColor: theme.success },
              error === "d" && { backgroundColor: theme.primary },
            ]}
          >
            <Text style={styles.answerIconText}>D</Text>
          </View>
          <Text style={styles.answerText}>
            {newExercise?.questions?.[active].d}
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

export default MultiChoose;
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
    answer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      backgroundColor: theme.secondary_50,
    },
    answerIcon: {
      width: 40,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      backgroundColor: theme.secondary,
      paddingLeft: 4,
    },
    answerIconTextContainer: {
      width: 36,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      borderTopLeftRadius: 14,
      borderBottomLeftRadius: 14,
      borderWidth: 1,
      borderRightWidth: 2,
      borderColor: "transparent",
    },
    answerSelectedContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderColor: "transparent",
      width: width - 76,
      height: 52,
    },
    answerIconText: {
      ...Fonts.S16W500,
      color: theme.white,
    },
    answerText: {
      ...Fonts.S14W500,
      color: theme.white,
      width: width - 78,
      paddingHorizontal: 12,
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
      backgroundColor: theme.text_20,
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
  });
