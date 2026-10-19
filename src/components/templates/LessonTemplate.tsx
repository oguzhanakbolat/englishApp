import { get } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Scroll from "../atoms/Scroll";
import LevelCard from "../molecules/LevelCard";

const LessonTemplate = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [levels, setLevels] = useState<any[]>([]);
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    if (!netInfo.isConnected) {
      const levels = await AsyncStorage.getItem("levels");
      setLevels(levels ? JSON.parse(levels) : []);
    } else {
      const [levelsResponse, exercisesResponse] = await Promise.all([
        get(
          `/levels?filter[language][$eq]=${user?.language}&sort=name:asc&populate[0]=cources`,
        ),
        get(
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
      AsyncStorage.setItem("levels", JSON.stringify(newLevelFull));
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [netInfo.isConnected]);

  return (
    <Scroll title="Derslerim" isLoading={loading} isEmpty={levels.length === 0}>
      {levels &&
        levels.length > 0 &&
        levels.map((level) => (
          <LevelCard
            key={level.name}
            progress={
              Number(user?.follows?.level || 1) < Number(level?.name || 1)
                ? 0
                : (level.exercises / level.courses) * 100
            }
            title={"Level " + level.name}
            locked={
              Number(user?.follows?.level || 1) < Number(level?.name || 1)
            }
            onPress={() =>
              router.push(`/(app)/(tabs)/level/${level?.name || 1}`)
            }
          />
        ))}
    </Scroll>
  );
};

export default LessonTemplate;
