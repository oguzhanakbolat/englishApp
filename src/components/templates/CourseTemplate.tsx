import { useTheme } from "@/hooks/use-theme";
import { get } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { followCalculate } from "@/utils/followCalculate";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Scroll from "../atoms/Scroll";
import CourseCard from "../molecules/CourseCard";

const CourseTemplate = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUserStore();
  const { id } = useLocalSearchParams();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<string>("");
  const [cource, setCource] = useState<string>("");
  const [cources, setCources] = useState<{
    data: any[];
    name: string;
    file: {
      url: string;
    };
    speakFile?: {
      url: string;
    };
    level: {
      name: string;
      id: number;
    };
  }>({ data: [], name: "", file: { url: "" }, level: { name: "", id: 0 } });

  const getMediaUrl = (media?: unknown) => {
    if (!media) return "";
    if (typeof media === "string") return media;
    if (typeof media !== "object") return "";
    const value = media as {
      url?: string;
      data?: { url?: string; attributes?: { url?: string } };
    };
    return value.url || value.data?.url || value.data?.attributes?.url || "";
  };

  const getData = async () => {
    setLoading(true);
    const idArray = id.toString()?.split("-");
    const level = idArray?.[0];
    const cource = idArray?.[1];
    if (level && cource) {
      setLevel(level);
      setCource(cource);
    }
    if (!netInfo.isConnected) {
      const cources = await AsyncStorage.getItem(
        "cources_" + level + "-" + cource,
      );
      setCources(cources ? JSON.parse(cources) : []);
      return;
    } else {
      const response = await get(
        `/cources?filters[name][$eq]=${cource}&filters[language][$eq]=${user?.language}&filters[level][name][$eq]=${level}&populate=*`,
      );

      if (response?.data?.data && response?.data?.data?.[0]) {
        setCources(response.data.data[0]);
        AsyncStorage.setItem(
          "cources_" + level + "-" + cource,
          JSON.stringify(response.data.data[0]),
        );
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [netInfo.isConnected]);

  return (
    <Scroll
      title={`Ders ${cource}`}
      isLoading={loading}
      isEmpty={cources?.data?.length === 0}
    >
      <View style={styles.container}>
        {cources &&
          cources?.data?.map((exercise: any) => (
            <CourseCard
              key={exercise.id}
              locked={followCalculate(
                cources?.level?.name,
                cources?.name,
                exercise.id,
                user?.follows,
              )}
              onPress={() =>
                router.push({
                  pathname: "/(app)/onlesson",
                  params: {
                    level: String(level),
                    cource: String(cource),
                    exerciseId: String(exercise.id),
                    data: JSON.stringify(exercise),
                    file: getMediaUrl(cources?.file),
                    speakFile:
                      getMediaUrl(cources?.speakFile) ||
                      getMediaUrl(exercise?.speakFile),
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
                        : exercise.type === "listenAndSpeak" ||
                            exercise.type === "ListenAndSpeak"
                          ? "Dinle ve Konuş"
                          : "Doğru Yanıtı Seç"
              }
              icon={
                exercise.type === "audio" ? (
                  <FontAwesome5 name="play" size={24} color={theme.secondary} />
                ) : exercise.type === "listenAndSpeak" ||
                  exercise.type === "ListenAndSpeak" ? (
                  <FontAwesome5
                    name="microphone"
                    size={24}
                    color={theme.secondary}
                  />
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
