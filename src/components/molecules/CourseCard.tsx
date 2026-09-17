import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CourseCard = ({
  locked,
  onPress,
  icon,
  title,
}: {
  locked: boolean;
  onPress: () => void;
  icon: ReactNode;
  title: string;
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, locked), [theme, locked]);

  const handlePress = () => {
    if (locked) {
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const createStyles = (theme: ReturnType<typeof useTheme>, locked: boolean) =>
  StyleSheet.create({
    container: {
      width: (width - 64) / 3 - 1,
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      backgroundColor: locked ? theme.secondary_10 : theme.secondary_40,
      boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.15)",
      padding: 12,
    },
    iconContainer: {
      position: "relative",
      width: 64,
      height: 64,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 36,
      backgroundColor: theme.white,
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
    textContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      ...Fonts.S16W600,
      color: locked ? theme.secondary_50 : theme.white,
      textAlign: "center",
    },
  });
