import { useEffect, useState } from "react";
import { View } from "react-native";

import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/hooks/use-theme";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
type AnimatedIconsProps = {
  color: string;
  size: number;
  icon: "check" | "close" | "exclamation" | "delete";
};

const AnimatedIcons = ({
  color,
  size = 300,
  icon = "check",
}: AnimatedIconsProps) => {
  const theme = useTheme();
  const progress1 = useSharedValue(0);
  const rotation1 = useSharedValue(0);
  const [rotationDegree1, setRotationDegree1] = useState(-90);

  const progress2 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const [rotationDegree2, setRotationDegree2] = useState(-90);

  // Icon animasyonu için scale ve opacity kullan
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);

  const opacity = useSharedValue(0);
  const r = useSharedValue(0);

  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  const animatedProps1 = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - Math.abs(progress1.value));
    return {
      strokeDashoffset,
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - Math.abs(progress2.value));
    return {
      strokeDashoffset,
    };
  });

  const animatedPropsOpacity = useAnimatedProps(() => {
    return {
      opacity: opacity.value,
      r: r.value,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
      opacity: iconOpacity.value,
    };
  });

  useAnimatedReaction(
    () => rotation1.value,
    (currentValue) => {
      const currentRotation = -90 - currentValue * 2;
      runOnJS(setRotationDegree1)(currentRotation);
    },
  );

  useAnimatedReaction(
    () => rotation2.value,
    (currentValue) => {
      const currentRotation = -90 - currentValue * 2;
      runOnJS(setRotationDegree2)(currentRotation);
    },
  );

  useEffect(() => {
    const startAnimations = () => {
      progress1.value = withTiming(-0.5, {
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      rotation1.value = withTiming(
        180,
        {
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        (finished) => {
          if (finished) {
            progress1.value = withTiming(0, {
              duration: 600,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            });
          }
        },
      );

      progress2.value = withDelay(
        300,
        withTiming(-0.5, {
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );

      rotation2.value = withDelay(
        300,
        withTiming(
          180,
          {
            duration: 800,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          },
          (finished) => {
            if (finished) {
              progress2.value = withTiming(0, {
                duration: 600,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              });
            }
          },
        ),
      );

      opacity.value = withDelay(
        750,
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );

      r.value = withDelay(
        850,
        withTiming(130, {
          duration: 500,
          easing: Easing.elastic(1.2),
        }),
      );

      iconOpacity.value = withDelay(
        1150,
        withTiming(1, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );

      iconScale.value = withDelay(
        1200,
        withTiming(1, {
          duration: 400,
          easing: Easing.elastic(1.5),
        }),
      );
    };

    requestAnimationFrame(startAnimations);
  }, [
    progress1,
    rotation1,
    progress2,
    rotation2,
    opacity,
    r,
    iconOpacity,
    iconScale,
  ]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 300 300" fill="none">
        <AnimatedCircle
          cx={150}
          cy={150}
          r={radius}
          strokeWidth={0}
          fill={color}
          animatedProps={animatedPropsOpacity}
        />
        <AnimatedCircle
          cx={150}
          cy={150}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={15}
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps1}
          opacity={0.6}
          transform={`rotate(${rotationDegree1} 150 150)`}
        />

        <AnimatedCircle
          cx={150}
          cy={150}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={15}
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps2}
          transform={`rotate(${rotationDegree2} 150 150)`}
        />
      </Svg>

      <Animated.View
        style={[
          {
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            width: 150,
            height: 150,
          },
          iconAnimatedStyle,
        ]}
      >
        {icon === "check" ? (
          <Feather name="check" size={size * 0.6} color={theme.white} />
        ) : icon === "close" ? (
          <AntDesign name="close" size={size * 0.6} color={theme.white} />
        ) : icon === "exclamation" ? (
          <AntDesign name="exclamation" size={size * 0.6} color={theme.white} />
        ) : icon === "delete" ? (
          <MaterialIcons
            name="delete-outline"
            size={size * 0.6}
            color={theme.white}
          />
        ) : null}
      </Animated.View>
    </View>
  );
};

export default AnimatedIcons;
