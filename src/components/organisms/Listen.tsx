import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { post } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { ExerciseType } from "@/types";
import { followCalculate } from "@/utils/followCalculate";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Insets,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type ListenType = {
  exercise: ExerciseType;
  level: number;
  lesson: number;
  audioUri?: string | null;
};

const Listen: FC<ListenType> = ({ exercise, level, lesson, audioUri }) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { user } = useUserStore();

  const [timeType, setTimeType] = useState<"forward" | "backward">("backward");
  const reportedTrackKeyRef = useRef<string | null>(null);

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const progress = useSharedValue(0);
  const styleProgress = useAnimatedStyle<ViewStyle>(() => ({
    width: `${progress.value}%`,
  }));

  const isPlaying = status.playing;
  const duration = status.duration ?? 0;
  const currentTime = status.currentTime ?? 0;
  const reachedHalfway = duration > 0 && currentTime >= duration / 2;
  const trackKey = `${audioUri ?? ""}-${exercise.id}`;

  useEffect(() => {
    if (!audioUri) return;
    player.replace({ uri: audioUri });
  }, [audioUri]);

  useEffect(() => {
    const target = duration > 0 ? (currentTime / duration) * 100 : 0;
    progress.value = withTiming(target, { duration: 300 });
  }, [currentTime, duration, progress]);

  const colorList = {
    A: theme.secondary_70,
    B: theme.primary_70,
    C: theme.text_70,
    D: theme.tertiary_70,
  };

  const onPlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      if (duration > 0 && currentTime >= duration) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const onPrevious = () => {
    player.seekTo(currentTime - 10);
  };

  const onNext = () => {
    player.seekTo(currentTime + 10);
  };

  const formatTime = (seconds: number) => {
    const total = Math.max(0, Math.floor(seconds));
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return [...m.split(""), ":", ...s.split("")];
  };

  const formatBackwardTime = (seconds: number) => {
    const total = Math.max(0, Math.floor(seconds));
    const remaining = Math.max(0, Math.floor(duration - total));
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const s = (remaining % 60).toString().padStart(2, "0");

    return [...m.split(""), ":", ...s.split("")];
  };

  const setData = async () => {
    if (user?.type === "outside" || user?.type === "inside") {
      if (followCalculate(level, lesson, exercise.id + 1, user?.follows)) {
        await post("/follows", {
          data: {
            cource: lesson,
            exercise: exercise.id + 1,
            level: level,
          },
        });
      }

      await post("/exercises", {
        data: {
          exercises: exercise.id.toString(),
          level: level.toString(),
          cource: lesson.toString(),
          point: 1000,
          user: user?.id,
        },
      });
    }
  };

  useEffect(() => {
    if (!reachedHalfway) return;
    if (reportedTrackKeyRef.current === trackKey) return;

    reportedTrackKeyRef.current = trackKey;
    void setData();
  }, [reachedHalfway, trackKey]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        data={exercise.text}
        renderItem={({ item }) => (
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.whoText,
                { color: colorList[item.who as keyof typeof colorList] },
              ]}
            >
              {item.who}:
            </Text>
            <Text
              style={[
                styles.textText,
                { color: colorList[item.who as keyof typeof colorList] },
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressBarFill, styleProgress]} />
          </View>
          <TouchableOpacity
            onPress={() =>
              setTimeType(timeType === "forward" ? "backward" : "forward")
            }
          >
            <View style={styles.progressBarTime}>
              {timeType === "backward"
                ? formatBackwardTime(currentTime).map((item, index) => (
                    <Text
                      key={index}
                      style={[styles.timeText, index === 2 && { width: 5 }]}
                    >
                      {item}
                    </Text>
                  ))
                : formatTime(currentTime).map((item, index) => (
                    <Text
                      key={index}
                      style={[styles.timeText, index === 2 && { width: 5 }]}
                    >
                      {item}
                    </Text>
                  ))}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRowContainer}>
          <TouchableOpacity style={styles.buttonPrevious} onPress={onPrevious}>
            <View style={styles.iconContainerPrevious}>
              <AntDesign name="rollback" size={18} color={theme.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPlay}>
            <View style={styles.iconContainer}>
              {isPlaying ? (
                <FontAwesome5 name="pause" size={32} color={theme.primary} />
              ) : (
                <FontAwesome5 name="play" size={32} color={theme.primary} />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNext} onPress={onNext}>
            <View style={styles.iconContainerNext}>
              <AntDesign name="rollback" size={18} color={theme.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Listen;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: width - 32,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      paddingBottom: inset.bottom ? inset.bottom + 8 : 16,
    },
    buttonRowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 40,
      width: 80,
      height: 80,
      backgroundColor: theme.primary_20,
    },
    iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 35,
      width: 70,
      height: 70,
      backgroundColor: theme.primary_20,
      borderWidth: 1,
      borderColor: theme.white,
    },
    listContainer: {
      flex: 1,
      width: "100%",
    },
    listContentContainer: {},
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: theme.secondary_10,
      paddingBottom: 8,
      marginBottom: 8,
    },
    whoText: {
      ...Fonts.S14W600,
    },
    textText: {
      ...Fonts.S14W400,
    },
    progressBarContainer: {
      width: width - 32,
      height: 24,
      marginBottom: 8,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      justifyContent: "space-between",
    },
    progressBar: {
      width: width - 90,
      height: 12,
      borderRadius: 12,
      backgroundColor: theme.primary_20,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 12,
      borderRadius: 12,
      backgroundColor: theme.primary,
    },
    progressBarTime: {
      flexDirection: "row",
    },
    timeText: {
      ...Fonts.S14W400,
      width: 10,
      textAlign: "center",
    },
    buttonPrevious: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 26,
      width: 52,
      height: 52,
      backgroundColor: theme.primary_20,
    },
    iconContainerPrevious: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 26,
      width: 40,
      height: 40,
      backgroundColor: theme.primary_20,
      borderWidth: 1,
      borderColor: theme.white,
    },
    iconContainerNext: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 26,
      width: 40,
      height: 40,
      backgroundColor: theme.primary_20,
      borderWidth: 1,
      borderColor: theme.white,
      transform: [{ rotate: "180deg" }, { scaleY: -1 }],
    },
    buttonNext: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 26,
      width: 52,
      height: 52,
      backgroundColor: theme.primary_20,
    },
  });
