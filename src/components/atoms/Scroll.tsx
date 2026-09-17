import { useTheme } from "@/hooks/use-theme";
import React, { ReactNode, useMemo } from "react";
import { Dimensions, Insets, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../molecules/Header";

const { width } = Dimensions.get("window");

const Scroll = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);

  return (
    <>
      <Header title={title} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>{children}</View>
      </ScrollView>
    </>
  );
};

export default Scroll;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    scrollView: {
      backgroundColor: theme.background,
    },
    container: {
      width,
      paddingHorizontal: 16,
      alignItems: "center",
      paddingTop: 16,
      paddingBottom: inset.bottom ? inset.bottom + 64 : 80,
    },
  });
