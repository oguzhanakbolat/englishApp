import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const Empty = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <LottieView
          autoPlay
          style={{ width: 180, height: 180 }}
          source={require("@/constants/nofile.json")}
        />
        <View style={styles.imageContainer}>
          <Image
            source={require("@/constants/images/2.png")}
            style={styles.image}
            contentFit="contain"
          />
        </View>
      </View>
      <Text style={styles.text}>Bu ders bulunamadı.</Text>
    </View>
  );
};

export default Empty;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    imageContainer: {
      width: 136,
      height: 250,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    text: {
      ...Fonts.S14W400,
      color: theme.text,
      textAlign: "center",
      marginTop: 16,
    },
  });
