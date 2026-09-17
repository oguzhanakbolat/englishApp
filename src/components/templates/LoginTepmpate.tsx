import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import AuthContainer from "@/components/organisms/AuthContainer";
import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { loginService } from "@/services";
import { useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta adresi zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
});

const LoginTemplate = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const response = await loginService(values.email, values.password);
      setIsLoading(false);

      if (rememberMe) {
        await AsyncStorage.setItem("email", values.email);
        await AsyncStorage.setItem("password", values.password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }

      if (response?.data?.jwt) {
        await login({
          user: response.data.user as UserType,
          token: response.data.jwt as string,
        });
      } else {
        Toast.error(response?.data?.message as string);
      }
    },
  });

  const handleForgotPassword = () => {
    router.push("/(auth)/forgotPassword");
  };

  const getFieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  const handleRememberMe = async () => {
    const email = await AsyncStorage.getItem("email");
    const password = await AsyncStorage.getItem("password");
    if (email && password) {
      formik.setValues({
        email,
        password,
      });
    }
  };

  useEffect(() => {
    handleRememberMe();
  }, []);

  return (
    <AuthContainer title="Giriş Yap">
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

      <View style={styles.optionsRow}>
        <Pressable
          style={styles.rememberRow}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && (
              <Ionicons name="checkmark" size={14} color={theme.white} />
            )}
          </View>
          <Text style={styles.rememberText}>Beni hatırla</Text>
        </Pressable>

        <Pressable onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Şifremi unuttum</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.buttonDisabled]}
        onPress={() => formik.handleSubmit()}
        activeOpacity={0.85}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.white} />
        ) : (
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Hesabınız yok mu? </Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.footerLink}>Kayıt Ol</Text>
        </Pressable>
      </View>
    </AuthContainer>
  );
};

export default LoginTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    fieldGroup: {
      marginBottom: 16,
    },
    label: {
      ...Fonts.S16W500,
      marginBottom: 4,
      color: theme.primary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 48,
      borderWidth: 0,
      borderColor: "transparent",
      backgroundColor: theme.primary_10,
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
    loginButton: {
      backgroundColor: theme.primary,
      height: 54,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 28,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      ...Fonts.S16W600,
      color: theme.white,
      width: "100%",
      textAlign: "center",
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
  });
