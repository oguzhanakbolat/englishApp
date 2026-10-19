import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";

import LottieView from "lottie-react-native";
import { useMemo } from "react";
import { Insets, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FileLoading = () => {
  const theme = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        style={{ width: 180, height: 180 }}
        source={require("@/constants/download.json")}
      />
      <Text style={styles.text}>Dosyayı indiriliyor...</Text>
      <Text style={styles.text}>Lütfen bekleyiniz.</Text>
    </View>
  );
};

export default FileLoading;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: (inset.bottom ?? 10) + 70,
    },
    text: {
      ...Fonts.S14W400,
      color: theme.text,
      textAlign: "center",
      marginTop: 8,
    },
  });
