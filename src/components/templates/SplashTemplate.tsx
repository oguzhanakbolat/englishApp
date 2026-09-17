import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import AnimatedLogo from "@/constants/animatedLogo";
import { useTheme } from "@/hooks/use-theme";

const { width, height } = Dimensions.get("window");

type SplashTemplateProps = {
  onFinish?: () => void;
};

const DURATION = 1000;

const SplashTemplate = ({ onFinish }: SplashTemplateProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const opacity = useSharedValue(0);
  const svCircle1 = useSharedValue(0);
  const svCircle2 = useSharedValue(0);
  const svCircle3 = useSharedValue(0);
  const svCircle4 = useSharedValue(0);
  const svCircle5 = useSharedValue(0);

  const styleOpacity = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const styleCircle1 = useAnimatedStyle(() => ({
    left: width / 2 - svCircle1.value / 2,
    width: svCircle1.value,
    height: svCircle1.value,
    top: height / 2 - svCircle1.value / 2,
  }));

  const styleCircle2 = useAnimatedStyle(() => ({
    left: width / 2 - svCircle2.value / 2,
    width: svCircle2.value,
    height: svCircle2.value,
    top: height / 2 - svCircle2.value / 2,
  }));

  const styleCircle3 = useAnimatedStyle(() => ({
    left: width / 2 - svCircle3.value / 2,
    width: svCircle3.value,
    height: svCircle3.value,
    top: height / 2 - svCircle3.value / 2,
  }));

  const styleCircle4 = useAnimatedStyle(() => ({
    left: width / 2 - svCircle4.value / 2,
    width: svCircle4.value,
    height: svCircle4.value,
    top: height / 2 - svCircle4.value / 2,
  }));

  const styleCircle5 = useAnimatedStyle(() => ({
    left: width / 2 - svCircle5.value / 2,
    width: svCircle5.value,
    height: svCircle5.value,
    top: height / 2 - svCircle5.value / 2,
  }));

  useEffect(() => {
    svCircle1.value = withTiming(width * 3, { duration: DURATION });

    setTimeout(() => {
      svCircle2.value = withTiming(width * 3, { duration: DURATION });
    }, DURATION * 0.2);

    setTimeout(() => {
      svCircle3.value = withTiming(width * 3, { duration: DURATION });
    }, DURATION * 0.4);

    setTimeout(() => {
      svCircle4.value = withTiming(width * 3, { duration: DURATION });
    }, DURATION * 0.6);

    setTimeout(() => {
      svCircle5.value = withTiming(width * 3, { duration: DURATION });
    }, DURATION * 0.8);

    setTimeout(() => {
      opacity.value = withTiming(1, { duration: DURATION * 3 });
    }, DURATION * 1);

    const finishTimeout = setTimeout(() => {
      onFinish?.();
    }, DURATION * 5);

    return () => clearTimeout(finishTimeout);
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width,
        height,
      }}
    >
      <Animated.View style={[styles.circle, styleCircle1]} />
      <Animated.View style={[styles.circle, styleCircle2]} />
      <Animated.View style={[styles.circle, styleCircle3]} />
      <Animated.View style={[styles.circle, styleCircle4]} />
      <Animated.View style={[styles.circle, styleCircle5]} />

      <Animated.View style={[styleOpacity]}>
        <AnimatedLogo fill={theme.white} size={250} />
      </Animated.View>
    </View>
  );
};

export default SplashTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      width,
      height,
    },
    circle: {
      position: "absolute",
      height: 0,
      width: 0,
      left: 0,
      top: 0,
      backgroundColor: theme.primary_50,
      borderRadius: 99999,
      justifyContent: "center",
      alignItems: "center",
    },
  });
