import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { useNetInfo } from "@react-native-community/netinfo";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const AuthLayout = () => {
  const netInfo = useNetInfo();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!netInfo.isConnected) {
    return (
      <View style={styles.container}>
        <LottieView
          autoPlay
          style={{ width: 180, height: 180 }}
          source={require("@/constants/noconnect.json")}
        />
        <Text style={styles.text}>
          Lütfen internet bağlantınızı kontrol ediniz
        </Text>
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
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgotPassword" />
      </Stack>
    </>
  );
};

export default AuthLayout;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      ...Fonts.S14W400,
      color: theme.text,
    },
  });
