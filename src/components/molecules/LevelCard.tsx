import { Fonts } from "@/constants/fonts";
import IconBg from "@/constants/images/iconbg";
import { useTheme } from "@/hooks/use-theme";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LevelCard = ({
  title,
  locked,
  onPress,
  progress,
}: {
  title: string;
  locked: boolean;
  onPress: () => void;
  progress: number;
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handlePress = () => {
    if (locked) {
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <View style={styles.bgContainer}>
          <IconBg size={72} />
        </View>
        <FontAwesome5
          name="play"
          size={24}
          color={locked ? theme.primary_50 : theme.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progress}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
      <View style={styles.lockContainer}>
        {locked ? (
          <Fontisto name="locked" size={21} color={theme.primary_50} />
        ) : (
          <Fontisto name="unlocked" size={21} color={theme.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LevelCard;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    buttonContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderRadius: 16,
      marginBottom: 16,
      paddingLeft: 8,
      paddingRight: 16,
      backgroundColor: theme.primary_10,
      boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.15)",
    },
    iconContainer: {
      position: "relative",
      width: 72,
      height: 72,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 6,
      marginBottom: 12,
      marginTop: 12,
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
      alignItems: "flex-start",
    },
    text: {
      ...Fonts.S16W600,
      color: theme.primary,
    },
    lockContainer: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 6,
    },
    progress: {
      width: 100,
      height: 8,
      backgroundColor: theme.primary_20,
      borderRadius: 4,
    },
    progressBar: {
      width: "100%",
      height: 8,
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    progressText: {
      ...Fonts.S12W600,
      color: theme.primary,
    },
  });
