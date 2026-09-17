import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { PointCalculatorType } from "@/utils/pointCalculator";
import { useMemo } from "react";
import {
  Dimensions,
  Insets,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedIcons from "../molecules/AnimatedIcons";

const width = Dimensions.get("window").width;

const Point = ({
  visible,
  points,
  onBack,
  onNext,
}: {
  visible: boolean;
  points: PointCalculatorType;
  onBack: () => void;
  onNext: () => void;
}) => {
  const theme = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          {points.percentage > 60 ? (
            <>
              <AnimatedIcons color={theme.success} size={180} icon="check" />
              <Text style={styles.text}>Toplam Puan: {points.points}</Text>
              <Text style={styles.text}>
                %{points.percentage.toFixed(2)} Başarı
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonBack} onPress={onBack}>
                  <Text style={styles.buttonBackText}>Tekrar Dene</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonNext} onPress={onNext}>
                  <Text style={styles.buttonNextText}>Sonraki Egzersiz</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <AnimatedIcons color={theme.danger} size={180} icon="close" />
              <Text style={styles.textDanger}>
                Toplam Puan: {points.points}
              </Text>
              <Text style={styles.textDanger}>
                %{points.percentage.toFixed(2)} Başarı
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonBack} onPress={onBack}>
                  <Text style={styles.buttonBackText}>Tekrar Dene</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Point;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    content: {
      width: width - 32,
      gap: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 16,
    },
    text: {
      ...Fonts.S18W600,
      color: theme.success,
      textAlign: "center",
    },
    textDanger: {
      ...Fonts.S18W600,
      color: theme.danger,
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 16,
      marginTop: 18,
    },
    buttonNext: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.success,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    buttonNextText: {
      ...Fonts.S14W400,
      color: theme.white,
      textAlign: "center",
    },
    buttonBack: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.text_30,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    buttonBackText: {
      ...Fonts.S14W400,
      color: theme.text,
      textAlign: "center",
    },
  });
