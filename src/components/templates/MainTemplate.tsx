import { Fonts } from "@/constants/fonts";
import IconBg from "@/constants/images/iconbg";
import { useTheme } from "@/hooks/use-theme";
import { get, put } from "@/services/api";
import { getUserImageUrl, useUserStore } from "@/stores/useUserStore";
import { Feather, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Insets,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const MainTemplate = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const netInfo = useNetInfo();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const router = useRouter();
  const { user } = useUserStore();
  const [exercises, setExercises] = useState<any[]>([]);
  const [maxPoint, setMaxPoint] = useState(0);
  const [wordList, setWordList] = useState<any[]>([]);
  const [patternList, setPatternList] = useState<any[]>([]);
  const [level, setLevel] = useState<any>({
    cources: [],
    totalLesson: 0,
    lesson: 0,
  });

  const getData = async () => {
    if (netInfo.isConnected && !user?.language) {
      await put(`/users/${user?.id}`, {
        language: "İngilizce",
      });
    }

    if (!netInfo.isConnected) {
      const exercises = await AsyncStorage.getItem("exercises");
      const maxPoint = await AsyncStorage.getItem("maxPoint");
      const level = await AsyncStorage.getItem("level");
      const wordList = await AsyncStorage.getItem("wordList");
      const patternList = await AsyncStorage.getItem("patternList");

      setExercises(exercises ? JSON.parse(exercises) : []);
      setMaxPoint(maxPoint ? Number(maxPoint) : 0);
      setLevel(
        level ? JSON.parse(level) : { cources: [], totalLesson: 0, lesson: 0 },
      );
      setWordList(wordList ? JSON.parse(wordList) : []);
      setPatternList(patternList ? JSON.parse(patternList) : []);
    } else if (user?.follows?.level) {
      const [levelResponse, exerciseResponse, wordListesponse] =
        await Promise.all([
          get(
            `/levels?filters[name][$eq]=${user?.follows?.level || 1}&populate=cources`,
          ),
          get(`/exercises?filters[user][id][$eq]=${user?.id}`),
          get(
            `/lists?filters[user][id][$eq]=${user?.id}&sort=createdAt:desc&pagination[pageSize]=100&populate=*`,
          ),
        ]);

      if (exerciseResponse?.data?.data) {
        const newExercises: any[] = [];

        exerciseResponse.data.data.filter((exercise: any) => {
          const date = new Date(exercise.createdAt);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const time = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          ).getTime();

          const findIndex = newExercises.findIndex((e: any) => e.date === time);

          if (findIndex > -1) {
            newExercises[findIndex].point += exercise.point;
          } else {
            newExercises.push({
              day: day < 10 ? "0" + day : day,
              month: month < 10 ? "0" + month : month,
              point: exercise.point,
              date: time,
            });
          }
        });

        let point = 0;

        newExercises.sort((a: any, b: any) => {
          return a.date - b.date;
        });

        const startDate = new Date(newExercises[0]?.date ?? Date.now());
        const missingDays = Math.max(0, 9 - newExercises.length);

        Array.from({ length: missingDays }).forEach((_, index) => {
          const newDate = new Date(startDate);
          newDate.setDate(startDate.getDate() - (index + 1));

          const month = newDate.getMonth() + 1;
          const day = newDate.getDate();
          const time = new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
          ).getTime();

          const findIndex = newExercises.findIndex(
            (e: any) => e.day === day && e.month === month,
          );

          if (findIndex > -1) {
            newExercises[findIndex].point += 0;
          }
          newExercises.push({
            day: day < 10 ? "0" + day : day,
            month: month < 10 ? "0" + month : month,
            point: 0,
            date: time,
          });
        });

        newExercises.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        newExercises.forEach((exercise) => {
          if (exercise.point > point) {
            point = exercise.point;
          }
        });

        setMaxPoint(point);
        setExercises(newExercises);

        AsyncStorage.setItem("exercises", JSON.stringify(newExercises));
        AsyncStorage.setItem("maxPoint", point.toString());
      }

      if (levelResponse?.data?.data && levelResponse.data.data?.[0]?.cources) {
        setLevel({
          cources: levelResponse.data.data[0].cources,
          totalLesson: levelResponse.data.data[0].cources.length,
          name: levelResponse.data.data[0].name,
        });
        AsyncStorage.setItem("level", JSON.stringify(level));
      }

      if (wordListesponse?.data?.data) {
        const newWordList: any[] = [];
        const newPatternList: any[] = [];

        wordListesponse.data.data.forEach((x: any) => {
          newWordList.push(...x.words);
          newPatternList.push(...x.patterns);
        });

        setWordList(newWordList);
        setPatternList(newPatternList);

        AsyncStorage.setItem("wordList", JSON.stringify(newWordList));
        AsyncStorage.setItem("patternList", JSON.stringify(newPatternList));
      }
    }
  };

  useEffect(() => {
    getData();
  }, [user?.follows?.level, netInfo.isConnected]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.imageContainer}>
            {getUserImageUrl(user?.image) ? (
              <Image
                source={{ uri: getUserImageUrl(user?.image) as string }}
                style={styles.image}
              />
            ) : (
              <Text style={styles.imageText}>
                {(user?.username?.charAt(0) || "") +
                  (user?.username?.charAt(1) || "")}
              </Text>
            )}
          </View>
          <View style={styles.name}>
            <Text style={styles.nameText}>{user?.username}</Text>
            <Text style={styles.emailText}>- {user?.email}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.userName}>
                Merhaba {user?.username.split(" ")[0]}
              </Text>
              <Text style={styles.text}>
                Dersinizi seçiniz. İlerlemenizi takip edin.
              </Text>
              <View>
                <View style={styles.textLevelContainer}>
                  <Text style={styles.titleLevel}>
                    Level {user?.follows?.level || 1}
                  </Text>
                  <Text style={styles.textLevel}>
                    {user?.follows?.cource || 1} / {level?.totalLesson || 1}
                  </Text>
                </View>
                <View style={styles.listContainer}>
                  {Array.from({ length: level?.totalLesson || 0 }).map(
                    (_, index) => (
                      <View
                        style={
                          index < Number(user?.follows.cource)
                            ? styles.lessonActive
                            : styles.lesson
                        }
                        key={index}
                      />
                    ),
                  )}
                </View>
              </View>
            </View>
            <View style={styles.cardImageContainer}>
              <Image
                source={require("@/constants/images/1.png")}
                style={styles.cardImage}
              />
            </View>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.itemCard, { backgroundColor: theme.secondary_20 }]}
              onPress={() =>
                router.push(
                  `/cource/${user?.follows?.level || 1}-${user?.follows?.cource || 1}`,
                )
              }
            >
              <Text style={[styles.itemCardTitle, { color: theme.secondary }]}>
                Derse Devam Et
              </Text>

              <View style={styles.iconContainer}>
                <View style={styles.bgContainer}>
                  <IconBg size={96} />
                </View>
                <FontAwesome5 name="play" size={27} color={theme.secondary} />
              </View>

              <Text style={[styles.itemCardText, { color: theme.secondary }]}>
                Seviye {user?.follows?.level}
              </Text>

              <Text style={[styles.itemCardText, { color: theme.secondary }]}>
                Ders {user?.follows?.cource}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemCard, { backgroundColor: theme.success_20 }]}
              onPress={() => (wordList.length > 0 ? router.push("/word") : {})}
            >
              <Text style={[styles.itemCardTitle, { color: theme.success }]}>
                Kelime Çalış
              </Text>
              <View style={styles.iconContainer}>
                <View style={styles.bgContainer}>
                  <IconBg size={96} />
                </View>
                <FontAwesome6 name="w" size={27} color={theme.success} />
              </View>
              <Text style={[styles.itemCardText, { color: theme.success }]}>
                {wordList.length} Kelime
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemCard, { backgroundColor: theme.warning_30 }]}
            >
              <Text style={[styles.itemCardTitle, { color: theme.danger }]}>
                Cümle Kalıbı Çalış
              </Text>

              <View style={styles.iconContainer}>
                <View style={styles.bgContainer}>
                  <IconBg size={96} />
                </View>
                <Feather name="align-justify" size={27} color={theme.danger} />
              </View>

              <Text style={[styles.itemCardText, { color: theme.danger }]}>
                {patternList.length} Cümle Kalıbı
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            <Text style={styles.weekDaysText}>Çalışma Temponuz</Text>
            <View style={styles.weekDays}>
              {exercises.map((day) => (
                <View style={styles.dayContainer} key={day.day}>
                  <View style={styles.day}>
                    <View
                      style={[
                        styles.dayActive,
                        { height: (day.point / maxPoint) * 140 },
                      ]}
                    />
                  </View>
                  <Text style={styles.dayText}>
                    {day.day}.{day.month}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MainTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    scrollView: {
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingTop: 16,
      paddingBottom: inset.bottom ? inset.bottom + 64 : 80,
    },
    headerContainer: {
      width,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: inset.top ? inset.top + 8 : 16,
      backgroundColor: theme.primary,
      paddingBottom: 16,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    imageContainer: {
      width: 46,
      height: 46,
      borderRadius: 46,
      backgroundColor: theme.white,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 46,
      height: 46,
      borderRadius: 46,
    },
    imageText: {
      ...Fonts.S21W700,
      color: theme.primary,
      textAlign: "center",
      lineHeight: 40,
      justifyContent: "center",
      alignItems: "center",
      textTransform: "uppercase",
    },
    name: {
      marginLeft: 12,
    },
    nameText: {
      ...Fonts.S14W600,
      color: theme.white,
    },
    emailText: {
      ...Fonts.S14W400,
      color: theme.white_70,
      marginTop: -3,
    },
    headerRight: {
      width: 40,
      height: 40,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: width - 32,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.primary_20,
      flexDirection: "row",
    },
    cardContent: {
      width: width - 158,
      justifyContent: "center",
    },
    cardImageContainer: {
      position: "absolute",
      right: 0,
      top: 8,
    },
    cardImage: {
      width: 120,
      height: 180,
      resizeMode: "contain",
    },
    userName: {
      ...Fonts.S18W600,
      color: theme.text,
    },
    text: {
      ...Fonts.S14W400,
      color: theme.text,
      marginVertical: 12,
      height: 50,
    },
    textLevelContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textLevel: {
      ...Fonts.S14W400,
      color: theme.text,
      marginBottom: 2,
    },
    titleLevel: {
      ...Fonts.S14W600,
      color: theme.text,
      marginBottom: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
      width: width - 32,
      marginTop: 24,
    },
    itemCard: {
      width: (width - 32) / 3 - 8,
      flex: 1,
      borderRadius: 16,
      padding: 16,
      justifyContent: "space-between",
      alignItems: "center",
    },
    itemCardText: {
      ...Fonts.S14W400,
      textAlign: "center",
    },
    itemCardTitle: {
      ...Fonts.S14W600,
      textAlign: "center",
    },
    itemCardIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 72,
      justifyContent: "center",
      alignItems: "center",
    },
    bgContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.5,
    },
    iconContainer: {
      position: "relative",
      width: 120,
      height: 82,
      borderRadius: 72,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 6,
      marginBottom: 12,
      marginTop: 12,
    },
    listContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      borderRadius: 12,
      overflow: "hidden",
    },
    lesson: {
      height: 12,
      backgroundColor: theme.primary_20,
      flex: 1,
    },
    lessonActive: {
      height: 12,
      backgroundColor: theme.primary_40,
      flex: 1,
    },
    weekRow: {
      justifyContent: "center",
      gap: 24,
      width: width - 32,
      marginTop: 16,
      padding: 16,
      backgroundColor: theme.tertiary_20,
      borderRadius: 16,
    },
    weekDays: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    dayContainer: {
      height: 140,
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 16,
    },
    day: {
      width: 20,
      height: 140,
      borderRadius: 20,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: theme.tertiary_10,
    },
    dayActive: {
      width: 20,
      borderRadius: 20,
      backgroundColor: theme.tertiary_40,
    },
    weekDaysText: {
      ...Fonts.S14W600,
      color: theme.tertiary,
    },
    dayText: {
      ...Fonts.S12W400,
      color: theme.tertiary,
      marginTop: 4,
    },
  });
