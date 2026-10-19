import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { get } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { AnswerType, UserType } from "@/types";
import pointCalculator, { PointCalculatorType } from "@/utils/pointCalculator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Insets,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Container from "../atoms/Container";
import Point from "../organisms/Point";

const width = Dimensions.get("window").width;

const pickUniqueIndexes = (length: number, count: number) => {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, count);
};

const WordsTemplate = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { user } = useUserStore();
  const [list, setList] = useState<any[]>([]);
  const netInfo = useNetInfo();
  const router = useRouter();

  const [question, setQuestion] = useState<any>(null);
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

  const getData = async () => {
    setIsLoading(true);

    if (!netInfo.isConnected) {
      const words = await AsyncStorage.getItem("words");
      setList(words ? JSON.parse(words) : []);
      return;
    } else {
      const response = await get(
        `/lists?filters[language][$eq]=${user?.language}&filters[user][id][$eq]=${user?.id}&populate=*`,
      );

      if (response?.data?.data && response?.data?.data?.[0]) {
        const list = response.data.data
          .map((item: any) => item.words)
          .flat()
          .filter((item: any) => item.type !== "axillary verb");

        setList(list);
        AsyncStorage.setItem("words", JSON.stringify(list));
      }
    }

    setIsLoading(false);
  };

  const createQuestion = () => {
    if (list.length < 4) return;

    const [index, aIndex, bIndex, cIndex] = pickUniqueIndexes(list.length, 4);

    const listData = [
      list[aIndex].translate,
      list[bIndex].translate,
      list[cIndex].translate,
      list[index].translate,
    ].sort(() => Math.random() - 0.5);

    const questionData = {
      question: list[index].word,
      id: list[index].id,
      correct:
        list[index].translate === listData[0]
          ? "a"
          : list[index].translate === listData[1]
            ? "b"
            : list[index].translate === listData[2]
              ? "c"
              : "d",
      a: listData[0],
      b: listData[1],
      c: listData[2],
      d: listData[3],
    };

    setQuestion(questionData);
  };

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

  const handleBackButton = () => {
    if (answer.length > 4) {
      setPoints(pointCalculator(answer, 0, 0, 0, user as UserType, "words"));
      setTimeout(() => {
        setFinished(true);
      }, 100);
    } else {
      router.back();
    }
  };

  const handleAnswer = (ans: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const newAnswer = {
      id: question?.id,
      questionId: question?.id,
      answer: ans,
      correct: ans === question?.correct,
      error: ans !== question?.correct,
    };

    const newAnswerList = [...(answer ?? []), newAnswer];

    setAnswer(newAnswerList as AnswerType[]);
    setSelected(ans);
    setCorrect(null);
    setError(null);

    const t1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setSelected(null);

      if (ans === question?.correct) {
        playSafely(correctAudio, "correct");
        setCorrect(ans);
        setError(null);
      } else {
        playSafely(wrongAudio, "wrong");
        setError(ans);
        setCorrect(question?.correct ?? null);
      }
    }, 1500);

    const t2 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setIsLoading(false);
      next();
    }, 3000);

    timeoutsRef.current.push(t1, t2);
  };

  const next = () => {
    setSelected(null);
    setCorrect(null);
    setError(null);
    createQuestion();
  };

  const handleBack = () => {
    setFinished(false);
    setAnswer([]);
    setSelected(null);
    setCorrect(null);
    setError(null);
    setActive(0);
  };

  const handleNext = () => {
    setFinished(false);
    setSelected(null);
    setCorrect(null);
    setError(null);
    setActive(0);
  };

  useEffect(() => {
    createQuestion();
  }, [list.length]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    getData();
  }, [netInfo.isConnected]);

  return (
    <Container
      title={"Kelime Egzersizleri"}
      haveBottom={false}
      onBackControl={handleBackButton}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.descriptionText}>
            Aşağıdaki kelimenin karşılığını seçiniz.
          </Text>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question?.question}</Text>
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
            <Text style={styles.answerText}>{question?.a}</Text>
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
            <Text style={styles.answerText}>{question?.b}</Text>
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
            <Text style={styles.answerText}>{question?.c}</Text>
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
            <Text style={styles.answerText}>{question?.d}</Text>
          </TouchableOpacity>
        </View>
        <Point
          visible={finished}
          points={points ?? { points: 0, percentage: 0 }}
          type="words"
          onBack={handleBack}
          onNext={handleNext}
        />
      </View>
    </Container>
  );
};

export default WordsTemplate;

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
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
      backgroundColor: theme.secondary_80,
      height: 60,
    },
    answerText: {
      ...Fonts.S14W500,
      color: theme.white,
      paddingHorizontal: 12,
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
