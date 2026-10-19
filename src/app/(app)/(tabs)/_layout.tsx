import AppTabs from "@/components/organisms/AppTabs";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabs {...props} />}
      backBehavior="history"
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="lesson" options={{ title: "Lesson" }} />
      <Tabs.Screen name="personal" options={{ title: "Personal" }} />
      <Tabs.Screen name="statistic" options={{ title: "Statistic" }} />
      <Tabs.Screen name="cource/[id]" options={{ href: null }} />
      <Tabs.Screen name="level/[id]" options={{ href: null }} />
    </Tabs>
  );
}
