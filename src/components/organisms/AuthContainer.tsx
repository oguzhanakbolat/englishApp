import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AnimatedLogo from "@/constants/animatedLogo";
import { Fonts } from "@/constants/fonts";
import London from "@/constants/images/london";
import { useTheme } from "@/hooks/use-theme";

const { width, height } = Dimensions.get("window");

const AuthContainer = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 700);
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              minHeight: height - insets.top - insets.bottom - 48,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.mainContainer,
              {
                minHeight: height - insets.top - insets.bottom - 48,
                paddingTop: insets.top + 24,
              },
            ]}
          >
            <View style={styles.headerContainer}>
              <AnimatedLogo fill={theme.white} size={width / 2} />
            </View>

            <View style={[styles.card, { paddingBottom: insets.bottom + 24 }]}>
              <View
                style={[
                  styles.illustrationContainer,
                  {
                    top: (-width * 230) / 500 + 32,
                    height: (width * 230) / 500,
                  },
                ]}
              >
                <London size={width} />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                {children}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default AuthContainer;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.primary,
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    scrollContent: {
      width: "100%",
      flex: 1,
    },
    headerContainer: {
      marginBottom: 32,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      flex: 1,
    },
    card: {
      width: width,
      backgroundColor: theme.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    contentContainer: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      width: width,
      paddingHorizontal: 28,
      paddingTop: 36,
    },
    title: {
      ...Fonts.S24W500,
      color: theme.primary,
      marginBottom: 8,
    },
    illustrationContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.3,
    },
  });
