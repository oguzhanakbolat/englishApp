import { useTheme } from "@/hooks/use-theme";
import { ReactNode, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../molecules/Header";

const { width } = Dimensions.get("window");

const Container = ({
  children,
  title,
  haveBottom = true,
  onBackControl,
}: {
  children: ReactNode;
  title: string;
  haveBottom?: boolean;
  onBackControl?: () => void;
}) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(
    () =>
      createStyles(
        theme,
        haveBottom ? (inset.bottom ? inset.bottom + 64 : 80) : 0,
      ),
    [theme, haveBottom],
  );

  return (
    <>
      <Header title={title} onBackControl={onBackControl} />
      <View style={styles.container}>{children}</View>
    </>
  );
};

export default Container;

const createStyles = (theme: ReturnType<typeof useTheme>, bottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width,
      paddingHorizontal: 16,
      alignItems: "center",
      paddingTop: 16,
      paddingBottom: bottom,
      backgroundColor: theme.background,
    },
  });
