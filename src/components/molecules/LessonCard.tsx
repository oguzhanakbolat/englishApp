import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { Fontisto } from "@expo/vector-icons";
import { ReactNode, useMemo } from "react";
import {
  Dimensions,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const LessonCard = ({
  title,
  progress,
  icon,
  locked,
  onPress,
}: {
  title: string;
  progress: number;
  icon: ReactNode;
  locked: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () => createStyles(theme, width, locked),
    [theme, width, locked],
  );

  const handlePress = () => {
    if (locked) {
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.headerContainer}>
        {icon}
        {locked ? (
          <Fontisto name="locked" size={21} color={theme.white_50} />
        ) : (
          <Fontisto name="unlocked" size={21} color={theme.white} />
        )}
      </View>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.textContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progress.toFixed(2) + "%"}</Text>
          <View style={styles.progress}>
            <View
              style={[
                styles.progressBar,
                { width: (progress + "%") as DimensionValue },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LessonCard;

const createStyles = (
  theme: ReturnType<typeof useTheme>,
  width: number,
  locked: boolean,
) =>
  StyleSheet.create({
    container: {
      width: (width - 48) / 2,
      gap: 6,
      borderRadius: 16,
      padding: 16,
      backgroundColor: locked ? theme.success_40 : theme.success_70,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 6,
    },
    textContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
    },
    text: {
      ...Fonts.S16W600,
      color: theme.white,
    },
    lockContainer: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    progressContainer: {
      alignItems: "flex-end",
      gap: 5,
      width: "100%",
    },
    progress: {
      width: "100%",
      height: 8,
      backgroundColor: theme.white_40,
      borderRadius: 4,
    },
    progressBar: {
      width: "100%",
      height: 8,
      backgroundColor: theme.white,
      borderRadius: 4,
    },
    progressText: {
      ...Fonts.S12W600,
      color: theme.white,
    },
  });
