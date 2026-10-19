import { useTheme } from "@/hooks/use-theme";
import { Feather, Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useMemo } from "react";
import { Insets, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppTabs({ state }: BottomTabBarProps) {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Pressable onPress={() => router.push("/")}>
          <View
            style={
              state.routes[state.index].name === "index"
                ? styles.activeTab
                : styles.tab
            }
          >
            <Feather
              name="home"
              size={24}
              color={
                state.routes[state.index].name === "index"
                  ? theme.primary
                  : theme.white
              }
            />
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/lesson")}>
          <View
            style={
              state.routes[state.index].name === "lesson" ||
              state.routes[state.index].name === "level/[id]" ||
              state.routes[state.index].name === "cource/[id]"
                ? styles.activeTab
                : styles.tab
            }
          >
            <Octicons
              name="book"
              size={24}
              color={
                state.routes[state.index].name === "lesson" ||
                state.routes[state.index].name === "level/[id]" ||
                state.routes[state.index].name === "cource/[id]"
                  ? theme.primary
                  : theme.white
              }
            />
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/personal")}>
          <View
            style={
              state.routes[state.index].name === "personal"
                ? styles.activeTab
                : styles.tab
            }
          >
            <Feather
              name="user"
              size={24}
              color={
                state.routes[state.index].name === "personal"
                  ? theme.primary
                  : theme.white
              }
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: inset.bottom ? inset.bottom + 8 : 16,
    },
    tabs: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.15)",
      height: 56,
      padding: 3,
      gap: 1,
      borderRadius: 56,
      backgroundColor: theme.primary,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      width: 50,
      borderRadius: 25,
      overflow: "hidden",
    },
    activeTab: {
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: theme.white,
      overflow: "hidden",
    },
  });
