import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { PointCalculatorType } from "@/utils/pointCalculator";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
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
  type,
}: {
  visible: boolean;
  points: PointCalculatorType;
  onBack: () => void;
  onNext: () => void;
  type: "words" | "exercises" | "patterns";
}) => {
  const theme = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const router = useRouter();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rowContainer}>
            {points.percentage >= 60 ? (
              <View style={styles.contentLeftSide}>
                <AnimatedIcons color={theme.success} size={100} icon="check" />
                <Text style={[styles.text, { marginTop: 32 }]}>
                  Toplam Puan: {points.points}
                </Text>
                <Text style={styles.text}>
                  %{points.percentage.toFixed(2)} Başarı
                </Text>
              </View>
            ) : (
              <View style={styles.contentLeftSide}>
                <AnimatedIcons color={theme.danger} size={100} icon="close" />
                <Text style={[styles.textDanger, { marginTop: 32 }]}>
                  Toplam Puan: {points.points}
                </Text>
                <Text style={styles.textDanger}>
                  %{points.percentage.toFixed(2)} Başarı
                </Text>
              </View>
            )}

            <View style={styles.contentRightSide}>
              <Image
                source={
                  points.percentage >= 60
                    ? require("@/constants/images/4.png")
                    : require("@/constants/images/2.png")
                }
                style={styles.image}
                contentFit="contain"
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {type === "words" ? (
              <TouchableOpacity
                style={styles.buttonBack}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonBackText}>Tamam</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.buttonBack} onPress={onBack}>
                  <Text style={styles.buttonBackText}>Tekrar Dene</Text>
                </TouchableOpacity>
                {points.percentage >= 60 && (
                  <TouchableOpacity style={styles.buttonNext} onPress={onNext}>
                    <Text style={styles.buttonNextText}>Sonraki Egzersiz</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
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
    rowContainer: {
      flexDirection: "row",
      gap: 16,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    contentLeftSide: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    text: {
      ...Fonts.S16W600,
      color: theme.success,
      textAlign: "center",
      marginBottom: 8,
    },
    textDanger: {
      ...Fonts.S16W600,
      color: theme.danger,
      textAlign: "center",
      marginBottom: 8,
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
    contentRightSide: {
      width: 136,
      height: 250,
      marginRight: 16,
    },
  });
