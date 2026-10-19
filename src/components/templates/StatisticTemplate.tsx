import { useTheme } from "@/hooks/use-theme";
import { get } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useMemo } from "react";
import { Insets, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StatisticTemplate = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { user } = useUserStore();

  const getData = async () => {
    const startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = new Date();
    const response = await get(
      `/exercises?filters[language][$eq]=${user?.language}&filters[createdAt][$gte]=${startDate.toISOString()}&filters[createdAt][$lte]=${endDate.toISOString()}&sort=createdAt:desc&pagination[pageSize]=1000`,
    );
    console.log(response.data.data.length);
  };

  useEffect(() => {
    void getData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Statistic</Text>
    </View>
  );
};

export default StatisticTemplate;

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
