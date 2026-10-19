import { useTheme } from "@/hooks/use-theme";
import { ReactNode, useMemo } from "react";
import { Dimensions, Insets, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../molecules/Header";
import Empty from "../organisms/Empty";
import Loading from "../organisms/Loading";

const { width } = Dimensions.get("window");

const Scroll = ({
  children,
  title,
  isLoading = false,
  isEmpty = false,
}: {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
  isEmpty?: boolean;
}) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);

  return (
    <>
      <Header title={title} />
      {isLoading ? (
        <Loading />
      ) : isEmpty ? (
        <Empty />
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>{children}</View>
        </ScrollView>
      )}
    </>
  );
};

export default Scroll;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    scrollView: {
      backgroundColor: theme.background,
      flex: 1,
    },
    container: {
      flex: 1,
      width: "100%",
      paddingHorizontal: 16,
      alignItems: "center",
      paddingTop: 16,
      paddingBottom: inset.bottom ? inset.bottom + 64 : 80,
    },
  });
