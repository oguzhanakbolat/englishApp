import { api } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Scroll from "../atoms/Scroll";
import LevelCard from "../molecules/LevelCard";

const LessonTemplate = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [levels, setLevels] = useState<any[]>([]);

  const getData = async () => {
    const [levelsResponse, exercisesResponse] = await Promise.all([
      api.get(
        `/levels?filter[language][$eq]=${user?.language}&sort=name:asc&populate[0]=cources`,
      ),
      api.get(
        `/exercises?filters[language][$eq]=${user?.language}&filters[user][id][$eq]=${user?.id}&sort=createdAt:desc&pagination[pageSize]=1000`,
      ),
    ]);

    let newLevels: any[] = [];
    let newExercises: any[] = [];

    if (levelsResponse.data.data) {
      newLevels = levelsResponse.data.data;
    }

    if (exercisesResponse.data.data) {
      newExercises = exercisesResponse.data.data;
    }

    const newLevelFull: any[] = [];

    newLevels.forEach((level) => {
      const exercises = newExercises.filter(
        (exercise: any) => exercise.level === level.name,
      );

      const controlExercises: any[] = [];

      exercises.forEach((exercise: any) => {
        const index = controlExercises.findIndex(
          (controlExercise: any) =>
            controlExercise.level === exercise.level &&
            controlExercise.course === exercise.course,
        );
        if (index === -1) {
          controlExercises.push(exercise);
        }
      });

      newLevelFull.push({
        name: level.name,
        exercises: controlExercises.length,
        courses: level.cources.length,
      });
    });

    setLevels(newLevelFull);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Scroll title="Derslerim">
      {levels.map((level) => (
        <LevelCard
          key={level.name}
          progress={
            Number(user?.follows.level) < Number(level.name)
              ? 0
              : (level.exercises / level.courses) * 100
          }
          title={"Level " + level.name}
          locked={Number(user?.follows.level) < Number(level.name)}
          onPress={() => router.push(`/(app)/(tabs)/level/${level.name}`)}
        />
      ))}
    </Scroll>
  );
};

export default LessonTemplate;
