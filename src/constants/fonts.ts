import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  useFonts,
} from "@expo-google-fonts/poppins";

export const useAppFonts = () =>
  useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

export const Fonts = {
  S10W400: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },
  S10W500: {
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },
  S10W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
  },
  S12W400: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  S12W500: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  S12W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  S14W400: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  S14W500: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  S14W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  S16W400: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  S16W500: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  S16W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  S18W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  S21W700: {
    fontFamily: "Poppins_700Bold",
    fontSize: 21,
  },
  S24W400: {
    fontFamily: "Poppins_400Regular",
    fontSize: 24,
  },
  S24W500: {
    fontFamily: "Poppins_500Medium",
    fontSize: 24,
  },
  S24W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
  },
  S24W900: {
    fontFamily: "Poppins_900Black",
    fontSize: 24,
  },
  S28W600: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 28,
  },
};
