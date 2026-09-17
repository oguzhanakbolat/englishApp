import { useTheme } from "@/hooks/use-theme";
import { get } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { FollowType } from "@/types";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Scroll from "../atoms/Scroll";
import CourseCard from "../molecules/CourseCard";

const lockCalculate = (
  level: any,
  cource: any,
  exercise: any,
  follows: FollowType | undefined,
) => {
  const newLevel = Number(level || 1) * 100;
  const newCource = Number(cource || 1) * 10;
  const newExercise = Number(exercise || 1);

  const newUserLevel = Number(follows?.level || 1) * 100;
  const newUserCource = Number(follows?.cource || 1) * 10;
  const newUserExercise = Number(follows?.exercise || 1);

  return (
    newLevel + newCource + newExercise >
    newUserLevel + newUserCource + newUserExercise + 1
  );
};

const CourseTemplate = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUserStore();
  const { id } = useLocalSearchParams();
  const [cources, setCources] = useState<{
    data: any[];
    name: string;
    file: {
      url: string;
    };
    level: {
      name: string;
      id: number;
    };
  }>({ data: [], name: "", file: { url: "" }, level: { name: "", id: 0 } });

  const getData = async () => {
    const response = await get(`/cources?filters[name][$eq]=${id}&populate=*`);

    if (response?.data?.data && response?.data?.data?.[0]) {
      setCources(response.data.data[0]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Scroll title={`Ders ${id}`}>
      <View style={styles.container}>
        {cources?.data?.map((exercise: any) => (
          <CourseCard
            key={exercise.id}
            locked={lockCalculate(
              cources?.level?.name,
              cources?.name,
              exercise.id,
              user?.follows,
            )}
            onPress={() =>
              router.push({
                pathname: "/(app)/onlesson",
                params: {
                  level: String(cources?.level?.name ?? ""),
                  cource: String(id),
                  exerciseId: String(exercise.id),
                  data: JSON.stringify(exercise),
                  file: cources?.file?.url ?? ("" as string),
                },
              })
            }
            title={
              exercise.type === "audio"
                ? "Dinle"
                : exercise.type === "fill-in-the-blank"
                  ? "Boşluk Doldur"
                  : exercise.type === "multiple-choice"
                    ? "Doğru Yanıtı Seç"
                    : exercise.type === "write"
                      ? "Yaz"
                      : "Doğru Yanıtı Seç"
            }
            icon={
              exercise.type === "audio" ? (
                <FontAwesome5 name="play" size={24} color={theme.secondary} />
              ) : exercise.type === "fill-in-the-blank" ? (
                <MaterialCommunityIcons
                  name="arrow-projectile-multiple"
                  size={27}
                  color={theme.secondary}
                />
              ) : exercise.type === "multiple-choice" ? (
                <MaterialCommunityIcons
                  name="dice-multiple-outline"
                  size={27}
                  color={theme.secondary}
                />
              ) : (
                <MaterialCommunityIcons
                  name="hexagon-multiple-outline"
                  size={24}
                  color={theme.secondary}
                />
              )
            }
          />
        ))}
      </View>
    </Scroll>
  );
};

export default CourseTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});
