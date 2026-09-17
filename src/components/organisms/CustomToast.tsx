import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const toMessage = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    const obj = value as Record<string, any>;
    if (typeof obj.message === "string") return obj.message;
    if (obj.error && typeof obj.error.message === "string") {
      return obj.error.message;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return "";
};

const CustomToast = ({
  type,
  text1,
}: {
  type: "error" | "success" | "info" | "warn";
  text1?: string;
  text2?: string;
  hide?: () => void;
}) => {
  const message = toMessage(text1);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {message ? <Text style={styles.text}>{message}</Text> : null}
      </View>
      <View style={styles.iconContainer}>
        {type === "error" ? (
          <View style={styles.errorIcon}>
            <AntDesign name="close" size={20} color={theme.white} />
          </View>
        ) : type === "success" ? (
          <View style={styles.successIcon}>
            <AntDesign name="check" size={20} color={theme.white} />
          </View>
        ) : type === "info" ? (
          <View style={styles.infoIcon}>
            <Text style={styles.text}>i</Text>
          </View>
        ) : type === "warn" ? (
          <View style={styles.warnIcon}>
            <Text
              style={{
                ...Fonts.S14W600,
                color: theme.white,
              }}
            >
              !
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CustomToast;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      width: width - 32,
      borderRadius: 32,
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 8,
      flexDirection: "row",
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.secondary,
      backgroundColor: theme.white,
      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    textContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      ...Fonts.S14W400,
      color: theme.text,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    errorIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.danger,
    },
    successIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.success,
    },
    infoIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    warnIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.warning,
    },
  });
