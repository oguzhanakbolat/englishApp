import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { FC, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProgressBarProps = {
  active: number;
  questions: number;
};

const ProgressBar: FC<ProgressBarProps> = ({ active, questions }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.progressRow}>
      <View style={styles.progressTrackFill} />
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((active + 1) / questions) * 100}%` },
          ]}
        >
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              {active + 1} / {questions}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 56,
      borderRadius: 12,
      backgroundColor: theme.primary_20,
      marginBottom: 16,
    },
    progressTrackFill: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 56,
      height: 42,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      backgroundColor: theme.primary_70,
    },
    progressText: {
      ...Fonts.S14W600,
      color: theme.primary,
    },
    progressTrack: {
      flex: 1,
      height: 42,
      borderRadius: 12,
    },
    progressFill: {
      height: 42,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: theme.primary_70,
      padding: 4,
      alignItems: "flex-end",
    },
    progressTextContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: 56,
      height: 34,
      borderRadius: 8,
      backgroundColor: theme.white,
    },
  });
