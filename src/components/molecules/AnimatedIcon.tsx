import AnimatedLogo from "@/constants/animatedLogo";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const keyframe = new Keyframe({
  0: {
    height,
    opacity: 1,
  },
  90: {
    height: height / 2,
    opacity: 1,
  },
  99: {
    height: height / 2,
    opacity: 0,
  },
  100: {
    height: 0,
    opacity: 0,
  },
});

export function AnimatedIcon() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const topAnimated = useSharedValue(height / 2 - width / 2);
  const styleTop = useAnimatedStyle(() => ({ top: topAnimated.value }));

  useEffect(() => {
    topAnimated.value = withTiming(0, { duration: 700 });
  }, [topAnimated]);

  return (
    <>
      <Animated.View
        style={[styles.container]}
        entering={keyframe.duration(700)}
      />
      <Animated.View style={[styles.logoContainer, styleTop]}>
        <AnimatedLogo fill={theme.white} size={width / 2} />
      </Animated.View>
    </>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      zIndex: 1000,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      height,
    },
    logoContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      width: width,
      height: width,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
  });
