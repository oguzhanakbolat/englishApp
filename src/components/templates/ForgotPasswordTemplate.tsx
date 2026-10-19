import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { forgotPasswordService } from "@/services";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta adresi zorunludur"),
});

const ForgotPasswordTemplate = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const response = await forgotPasswordService(values.email);

      if (response.status === 200) {
        Toast.success(
          "Şifremi sıfırlama için e-posta adresinize bir kod gönderildi",
        );
        router.push("/(auth)/resetpassword");
      } else {
        Toast.error(response.data.message as string);
      }

      setIsLoading(false);
    },
  });

  const getFieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  return (
    <AuthContainer title="Şifremi Unuttum">
      <Text style={styles.text}>
        Şifremi sıfırlama için e-posta adresinizi giriniz.
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email</Text>
        <View
          style={[
            styles.inputContainer,
            getFieldError("email") ? styles.inputError : undefined,
          ]}
        >
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

export default ForgotPasswordTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
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
    buttonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      ...Fonts.S16W600,
      color: theme.white,
    },
    backButtonText: {
      ...Fonts.S16W600,
      color: theme.primary,
    },
  });
