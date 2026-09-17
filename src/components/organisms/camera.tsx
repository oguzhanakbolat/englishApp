import { useSettingStore } from "@/stores/useSettingStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraCapturedPicture, CameraView } from "expo-camera";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Camera = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isOpenCamera, setIsOpenCamera, cameraRef, setImage } =
    useSettingStore();

  const takePicture = async () => {
    if (cameraRef.current) {
      const data: CameraCapturedPicture =
        await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
          exif: false,
        });

      setImage(data);
      setIsOpenCamera(false);
    }
  };

  return (
    <>
      {isOpenCamera && (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onCameraReady={() => {
              setIsOpenCamera(true);
            }}
          />
          <View style={[styles.cameraOverlay, { bottom: insets.bottom + 16 }]}>
            <View
              style={[styles.leftButton, { backgroundColor: theme.secondary }]}
            >
              <TouchableOpacity
                style={styles.leftButton}
                onPress={() => setIsOpenCamera(false)}
              >
                <Ionicons name="chevron-back" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.centerButton,
                { backgroundColor: theme.secondary },
              ]}
            >
              <TouchableOpacity
                style={styles.centerButton}
                onPress={takePicture}
              >
                <MaterialIcons name="camera" size={42} color={theme.text} />
              </TouchableOpacity>
            </View>
            <View
              style={[styles.rightButton, { backgroundColor: theme.secondary }]}
            >
              <TouchableOpacity style={styles.rightButton}>
                <Ionicons name="images-sharp" size={18} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Camera;

const styles = StyleSheet.create({
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "#010101",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: width - 32,
    height: width - 32,
  },
  cameraOverlay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  leftButton: {
    width: 60,
    height: 42,
    paddingRight: 16,
    marginRight: -18,
    borderTopLeftRadius: 42,
    borderBottomLeftRadius: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    width: 60,
    height: 42,
    paddingLeft: 12,
    marginLeft: -18,
    borderTopRightRadius: 42,
    borderBottomRightRadius: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 72,
    height: 72,
    borderRadius: 72,
    justifyContent: "center",
    alignItems: "center",
  },
});
