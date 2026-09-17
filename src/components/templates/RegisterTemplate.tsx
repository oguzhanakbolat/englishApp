import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import { Fonts } from "@/constants/fonts";

import AuthContainer from "@/components/organisms/AuthContainer";
import { useTheme } from "@/hooks/use-theme";
import { registerService } from "@/services";
import { useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Kullanıcı adı en az 2 karakter olmalıdır")
    .required("Kullanıcı adı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta adresi zorunludur"),
  password: Yup.string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .required("Şifre zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre onayı zorunludur"),
});

const { width } = Dimensions.get("window");

const RegisterTemplate = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const response = await registerService({
        email: values.email,
        username: values.username,
        password: values.password,
      });
      if (response.success) {
        await login({
          user: response.data.user as UserType,
          token: response.data.jwt as string,
        });
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
    <AuthContainer title="Kayıt Ol">
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ad</Text>
        <View
          style={[
            styles.inputContainer,
            getFieldError("username") ? styles.inputError : undefined,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı adınızı oluşturunuz"
            placeholderTextColor={theme.primary_70}
            value={formik.values.username}
            onChangeText={formik.handleChange("username")}
            onBlur={formik.handleBlur("username")}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {getFieldError("username") && (
          <Text style={styles.errorText}>{formik.errors.username}</Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Eposta</Text>
        <View
          style={[
            styles.inputContainer,
            getFieldError("email") ? styles.inputError : undefined,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="E-posta adresinizi giriniz"
            placeholderTextColor={theme.primary_70}
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {getFieldError("email") && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
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

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Şifre Tekrar</Text>
        <View
          style={[
            styles.inputContainer,
            getFieldError("confirmPassword") ? styles.inputError : undefined,
          ]}
        >
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor={theme.primary_70}
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange("confirmPassword")}
            onBlur={formik.handleBlur("confirmPassword")}
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
        {getFieldError("confirmPassword") && (
          <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
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
    </AuthContainer>
  );
};

export default RegisterTemplate;

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
    text: {
      ...Fonts.S14W400,
      color: theme.primary_70,
      marginBottom: 28,
    },
    fieldGroup: {
      marginBottom: 16,
    },
    label: {
      ...Fonts.S16W500,
      color: theme.primary,
      marginBottom: 4,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary_10,
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 48,
      borderWidth: 0,
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
      textAlignVertical: "center",
      includeFontPadding: false,
      paddingVertical: 0,
      height: 48,
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
    illustrationContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.3,
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
  });
