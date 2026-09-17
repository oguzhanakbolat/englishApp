import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

export const SUPPORTED_LANGUAGES = ["tr", "en", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "tr";
const LANGUAGE_STORAGE_KEY = "app.language";

const resources = {
  tr: { translation: tr },
  en: { translation: en },
  de: { translation: de },
} as const;

const isSupported = (
  code: string | null | undefined,
): code is SupportedLanguage =>
  !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

const resolveDeviceLanguage = (): SupportedLanguage => {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  return isSupported(code) ? code : DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  compatibilityJSON: "v4",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export const initI18n = async () => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initial = isSupported(stored) ? stored : resolveDeviceLanguage();
    if (i18n.language !== initial) {
      await i18n.changeLanguage(initial);
    }
  } catch {
    // storage okunamazsa varsayılan dil kalır
  }
};

export const changeLanguage = async (lang: SupportedLanguage) => {
  await i18n.changeLanguage(lang);
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // persist başarısız olsa bile runtime'da dil değişmiş olur
  }
};

export default i18n;
