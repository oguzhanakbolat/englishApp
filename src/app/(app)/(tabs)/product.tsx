import { useTheme } from "@/hooks/use-theme";
import { useUserStore } from "@/stores/useUserStore";
import React, { useMemo } from "react";
import { Insets, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Personal = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { user } = useUserStore();
  return (
    <View style={styles.container}>
      <Text>Product</Text>
    </View>
  );
};

export default Personal;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    },
  });
