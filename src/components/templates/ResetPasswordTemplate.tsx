import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import AnimatedLogo from "@/constants/animatedLogo";
import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { resetPasswordService } from "@/services";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta adresi zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  code: Yup.string()
    .min(6, "Kod 6 karakter olmalıdır")
    .max(6, "Kod 6 karakter olmalıdır")
    .required("Kod zorunludur"),
});

const { width, height } = Dimensions.get("window");

const ResetPasswordTemplate = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      code: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const response = await resetPasswordService(
        values.email,
        values.password,
        values.code,
      );

      if (response.success) {
        Toast.success("Şifreniz başarıyla sıfırlandı");
        router.push("/(auth)/login");
      } else {
        Toast.error(response.error as string);
      }

      setIsLoading(false);
    },
  });

  const getFieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
            minHeight: height - insets.top - insets.bottom - 48,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            minHeight: height - insets.top - insets.bottom - 48,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={styles.headerContainer}>
            <AnimatedLogo fill={theme.primary} size={width / 2} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Şifremi Sıfırla</Text>
            <Text style={styles.text}>
              Şifremi sıfırlama için e-posta adresinize gelen kodu, e-posta
              adresinizi ve yeni şifrenizi giriniz.
            </Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  getFieldError("email") ? styles.inputError : undefined,
                ]}
              >
                <MaterialIcons
                  name="mail-outline"
                  size={20}
                  color={theme.primary_70}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  placeholderTextColor={theme.primary_70}
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {getFieldError("email") && (
                <Text style={styles.errorText}>{formik.errors.email}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kod</Text>
              <View
                style={[
                  styles.inputContainer,
                  getFieldError("code") ? styles.inputError : undefined,
                ]}
              >
                <MaterialIcons
                  name="code"
                  size={20}
                  color={theme.primary_70}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Kod giriniz"
                  placeholderTextColor={theme.primary_70}
                  value={formik.values.code}
                  onChangeText={formik.handleChange("code")}
                  onBlur={formik.handleBlur("code")}
                />
              </View>
              {getFieldError("code") && (
                <Text style={styles.errorText}>{formik.errors.code}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View
                style={[
                  styles.inputContainer,
                  getFieldError("password") ? styles.inputError : undefined,
                ]}
              >
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color={theme.primary_70}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.primary_70}
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={22}
                    color={theme.primary_70}
                  />
                </Pressable>
              </View>
              {getFieldError("password") && (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.backButton, isLoading && styles.buttonDisabled]}
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                <MaterialIcons
                  name="arrow-back-ios"
                  size={20}
                  color={theme.primary}
                  style={styles.inputIcon}
                />

                <Text style={styles.backButtonText}>Geri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={() => formik.handleSubmit()}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Şifremi Sıfırla</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary_10,
    },
    scrollContent: {
      alignItems: "center",
      width: "100%",
    },
    headerContainer: {
      marginBottom: 32,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      flex: 1,
    },
    card: {
      backgroundColor: theme.white,
      borderRadius: 32,
      width: width - 32,
      paddingHorizontal: 28,
      paddingTop: 36,
      paddingBottom: 24,
    },
    title: {
      ...Fonts.S24W500,
      color: theme.primary,
      marginBottom: 4,
    },
    text: {
      ...Fonts.S14W400,
      color: theme.primary_70,
      marginBottom: 28,
    },
    fieldGroup: {
      marginBottom: 18,
    },
    label: {
      ...Fonts.S16W500,
      color: theme.primary,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary_10,
      borderRadius: 8,
      paddingHorizontal: 14,
      height: 52,
      borderWidth: 1.5,
      borderColor: "transparent",
    },
    inputError: {
      borderColor: theme.danger,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      ...Fonts.S14W400,
      color: theme.text,
      flex: 1,
      height: "100%",
    },
    eyeButton: {
      padding: 4,
    },
    errorText: {
      ...Fonts.S10W400,
      color: theme.danger,
      marginTop: 6,
      marginLeft: 4,
    },
    optionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 28,
      marginTop: 4,
    },
    rememberRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: theme.primary_40,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    rememberText: {
      ...Fonts.S14W400,
      color: theme.primary,
    },
    forgotText: {
      ...Fonts.S14W500,
      color: theme.primary,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      gap: 10,
    },
    loginButton: {
      backgroundColor: theme.primary,
      height: 54,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 28,
      flexDirection: "row",
      gap: 10,
      flex: 1,
    },
    backButton: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.primary,
      height: 54,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 28,
      flexDirection: "row",
      gap: 10,
      flex: 1,
    },
    backButtonText: {
      ...Fonts.S16W600,
      color: theme.primary,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      ...Fonts.S16W600,
      color: theme.white,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 18,
    },
    footerText: {
      ...Fonts.S14W400,
      color: theme.text_50,
    },
    footerLink: {
      ...Fonts.S14W600,
      color: theme.primary,
    },
  });
