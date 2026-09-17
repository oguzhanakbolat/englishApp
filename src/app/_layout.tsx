import Camera from "@/components/organisms/camera";
import CustomToast from "@/components/organisms/CustomToast";
import SplashTemplate from "@/components/templates/SplashTemplate";
import { useAppFonts } from "@/constants/fonts";
import { initI18n } from "@/i18n";

import { useUserStore } from "@/stores/useUserStore";
import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";
import ToastManager from "toastify-react-native";
import env from "../../env";

SplashScreen.preventAutoHideAsync().catch(() => {});

const toastConfig = {
  error: (props: { text1?: string; text2?: string; hide?: () => void }) => (
    <CustomToast {...props} type="error" />
  ),
  success: (props: { text1?: string; text2?: string; hide?: () => void }) => (
    <CustomToast {...props} type="success" />
  ),
  info: (props: { text1?: string; text2?: string; hide?: () => void }) => (
    <CustomToast {...props} type="info" />
  ),
  warn: (props: { text1?: string; text2?: string; hide?: () => void }) => (
    <CustomToast {...props} type="warn" />
  ),
};

export default function RootLayout() {
  const { isAuthenticated, authenticatedControl, isLoading } = useUserStore();
  const [fontsLoaded, fontsError] = useAppFonts();
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [startApp, setStartApp] = useState(false);

  useEffect(() => {
    initI18n().finally(() => setIsI18nReady(true));
  }, []);

  useEffect(() => {
    if (
      (fontsLoaded || fontsError) &&
      isI18nReady &&
      isSplashFinished &&
      !isLoading
    ) {
      setStartApp(true);
    }
  }, [fontsLoaded, fontsError, isI18nReady, isSplashFinished]);

  const handleSplashFinish = useCallback(() => {
    setIsSplashFinished(true);
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    authenticatedControl();
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: "duckOthers",
    }).catch(() => {});
  }, []);

  if (
    ((!fontsLoaded && !fontsError) || !isI18nReady || !startApp) &&
    !env.isTest &&
    !isLoading
  ) {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="auto">
        <SplashTemplate onFinish={handleSplashFinish} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      <ToastManager config={toastConfig} />
      <Camera />
    </>
  );
}
