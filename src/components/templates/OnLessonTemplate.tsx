import { ExerciseType } from "@/data";
import { useTheme } from "@/hooks/use-theme";
import { cdnURL } from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Insets, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Container from "../atoms/Container";
import FillInTheBlank from "../organisms/FillInTheBlank";
import Listen from "../organisms/Listen";
import MultiChoose from "../organisms/MultiChoose";
import Write from "../organisms/Write";

const OnLessonTemplate = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { level, cource, exerciseId, data, file } = useLocalSearchParams<{
    level: string;
    cource: string;
    exerciseId: string;
    data: string;
    file: string;
  }>();
  const exercise = useMemo(
    () => JSON.parse(data ?? "{}") as ExerciseType,
    [data],
  );

  console.log({ file: cdnURL + file });

  return (
    <Container title={"Egzersiz " + (exerciseId ?? "")} haveBottom={false}>
      <View style={styles.container}>
        {exercise &&
          (exercise?.type === "audio" ? (
            <Listen
              exercise={exercise}
              level={Number(level) ?? 0}
              lesson={Number(cource) ?? 0}
            />
          ) : exercise?.type === "multiple-choice" ? (
            <MultiChoose
              exercise={exercise}
              level={Number(level) ?? 0}
              lesson={Number(cource) ?? 0}
            />
          ) : exercise.type === "write" ? (
            <Write
              exercise={exercise}
              level={Number(level) ?? 0}
              lesson={Number(cource) ?? 0}
            />
          ) : (
            <FillInTheBlank
              exercise={exercise}
              level={Number(level) ?? 0}
              lesson={Number(cource) ?? 0}
            />
          ))}
      </View>
    </Container>
  );
};

export default OnLessonTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
