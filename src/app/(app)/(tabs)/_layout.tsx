import AppTabs from "@/components/organisms/AppTabs";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabs {...props} />}
      backBehavior="history"
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="Lesson" options={{ title: "Lesson" }} />
      <Tabs.Screen name="personal" options={{ title: "Personal" }} />
      <Tabs.Screen name="product" options={{ title: "Product" }} />
    </Tabs>
  );
}
