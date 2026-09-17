import { useTheme } from "@/hooks/use-theme";
import { api } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { FollowType } from "@/types";
import { Foundation } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Scroll from "../atoms/Scroll";
import LessonCard from "../molecules/LessonCard";

const lockCalculate = (
  level: any,
  cource: any,
  follows: FollowType | undefined,
) => {
  const newLevel = Number(level || 1) * 100;
  const newCource = Number(cource || 1) * 10;

  const newUserLevel = Number(follows?.level || 1) * 100;
  const newUserCource = Number(follows?.cource || 1) * 10;

  return newLevel + newCource > newUserLevel + newUserCource + 1;
};

const LevelTemplate = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUserStore();
  const [lessons, setLessons] = useState<any[]>([]);
  const theme = useTheme();

  const getLessons = async () => {
    const [lessonsResponse, exercisesResponse] = await Promise.all([
      api.get(`/cources?filters[level][name][$eq]=${id}&sort=name:asc`),

      api.get(
        `/exercises?filters[language][$eq]=${user?.language}&filters[user][id][$eq]=${user?.id}&sort=createdAt:desc&pagination[pageSize]=1000`,
      ),
    ]);

    let newLessons: any[] = [];
    let newExercises: any[] = [];

    if (lessonsResponse.data.data) {
      newLessons = lessonsResponse.data.data;
    }

    if (exercisesResponse.data.data) {
      newExercises = exercisesResponse.data.data;
    }

    newLessons.sort((a: any, b: any) => Number(a.name) - Number(b.name));

    const newLessonsFull: any[] = [];

    newLessons.forEach((lesson) => {
      const exercises = newExercises.filter(
        (exercise: any) =>
          exercise.level === id && exercise.cource === lesson.name,
      );

      const controlExercises: any[] = [];

      exercises.forEach((exercise: any) => {
        const index = controlExercises.findIndex(
          (controlExercise: any) => controlExercise.cource === exercise.cource,
        );

        if (index === -1) {
          controlExercises.push(exercise);
        }
      });

      newLessonsFull.push({
        name: lesson.name,
        exercises: controlExercises.length,
        courses: lesson?.data?.length || 0,
      });
    });

    setLessons(newLessonsFull);
  };

  useEffect(() => {
    getLessons();
  }, [id]);

  return (
    <Scroll title={`Level ${Number(id)}`}>
      <View style={styles.container}>
        {lessons &&
          lessons.length > 0 &&
          lessons.map((lesson) => (
            <LessonCard
              key={lesson.name}
              title={"Ders " + lesson.name}
              progress={
                Number(user?.follows.cource) < Number(lesson.name)
                  ? 0
                  : (lesson.exercises / (lesson.courses || 1)) * 100
              }
              icon={
                <Foundation
                  name="list"
                  size={32}
                  color={
                    Number(user?.follows.cource) < Number(lesson.name)
                      ? theme.white_50
                      : theme.white
                  }
                />
              }
              locked={lockCalculate(id, lesson.name, user?.follows)}
              onPress={() => router.push(`/(app)/(tabs)/cource/${lesson.name}`)}
            />
          ))}
      </View>
    </Scroll>
  );
};

export default LevelTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});
