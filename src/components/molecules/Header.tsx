import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Dimensions,
  Insets,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Header = ({
  title,
  onBackControl,
}: {
  title: string;
  onBackControl?: () => void;
}) => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);

  const handleBack = () => {
    if (onBackControl) {
      onBackControl();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color={theme.white} />
        </TouchableOpacity>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.button} />
      </View>
    </View>
  );
};

export default Header;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: inset.top ? inset.top + 8 : 16,
      backgroundColor: theme.primary,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    button: {
      width: 74,
      height: 42,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
    },
    text: {
      ...Fonts.S16W600,
      color: theme.white,
    },
  });
