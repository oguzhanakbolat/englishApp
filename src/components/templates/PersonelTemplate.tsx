import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";
import { get, postData, put } from "@/services/api";
import { useSettingStore } from "@/stores/useSettingStore";
import { getUserImageUrl, mapUser, useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Insets,
  KeyboardAvoidingView,
  Modal,
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
import { Toast } from "toastify-react-native";

type EditableField = "username" | "gender" | "birthday" | "image";

const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const PICKER_ITEM_HEIGHT = 44;
const PICKER_VISIBLE = 5;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, index) => CURRENT_YEAR - 99 + index);

const pad2 = (value: number) => String(value).padStart(2, "0");

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const toIsoDate = (year: number, month: number, day: number) =>
  `${year}-${pad2(month)}-${pad2(day)}`;

const parseIsoDate = (value?: string) => {
  const match = value?.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { year: 2000, month: 1, day: 1 };
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const maxDay = daysInMonth(year, month);
  return {
    year,
    month,
    day: Math.min(day, maxDay),
  };
};

const GENDER_OPTIONS = [
  { value: "Kadın", label: "Kadın" },
  { value: "Erkek", label: "Erkek" },
];

const genderLabel = (value?: string) => {
  if (!value) return "Eklenmedi";
  const normalized = value.toLowerCase();
  const match = GENDER_OPTIONS.find(
    (item) =>
      item.value === normalized ||
      item.label.toLowerCase() === normalized ||
      (normalized === "female" && item.value === "kadın") ||
      (normalized === "male" && item.value === "erkek"),
  );
  return match?.label || value;
};

const formatBirthday = (value?: string) => {
  if (!value) return "Eklenmedi";
  const parsed = parseIsoDate(value);
  const date = new Date(parsed.year, parsed.month - 1, parsed.day);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatBirthdayLong = (value?: string) => {
  if (!value) return "";
  const parsed = parseIsoDate(value);
  return `${parsed.day} ${MONTHS_TR[parsed.month - 1]} ${parsed.year}`;
};

const friendlyError = (error?: string | null) => {
  const message = (error || "").toLowerCase();
  if (
    message.includes("unique") ||
    message.includes("already taken") ||
    message.includes("already exist") ||
    message.includes("must be unique")
  ) {
    return "Bu kullanıcı adı zaten alınmış";
  }
  return error || "İşlem başarısız";
};

const Personal = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { user, setUser, logout } = useUserStore();
  const { setIsOpenCamera, image, clearImage, isOpenCamera } =
    useSettingStore();

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingImageUpload, setPendingImageUpload] = useState(false);
  const uploadingRef = useRef(false);

  const applyUser = (data: any, extra?: Partial<UserType>) => {
    setUser(mapUser({ ...user, ...data, ...extra }));
  };

  const refreshUser = async (extra?: Partial<UserType>) => {
    const response = await get("/users/me?populate=*");
    if (response.status && response.data) {
      applyUser(response.data, extra);
      return true;
    }
    return false;
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const response = await get("/users/me?populate=*");
      if (active && response.status && response.data) {
        const current = useUserStore.getState().user;
        setUser(mapUser({ ...current, ...response.data }));
      }
    })();
    return () => {
      active = false;
    };
  }, [setUser]);

  const closeModal = () => {
    setEditingField(null);
    setDraft("");
    setFormError("");
    setSaving(false);
  };

  const showError = (message: string) => {
    setFormError(message);
    Toast.error(message);
  };

  const patchUser = async (
    payload: Record<string, unknown>,
    extra?: Partial<UserType>,
  ) => {
    if (!user?.id) return false;
    const response = await put(`/users/${user.id}`, payload);
    if (!response.status) {
      showError(friendlyError(response.error || "Güncelleme başarısız"));
      return false;
    }
    const refreshed = await refreshUser(extra);
    if (!refreshed) {
      applyUser(payload, extra);
    }
    Toast.success("Profil güncellendi");
    return true;
  };

  const saveUsername = async () => {
    const username = draft.trim();
    if (username.length < 2) {
      showError("Kullanıcı adı en az 2 karakter olmalı");
      return;
    }
    if (username.toLowerCase() === user?.username?.toLowerCase()) {
      closeModal();
      return;
    }

    setFormError("");
    setSaving(true);
    const check = await get(
      `/users?filters[username][$eq]=${encodeURIComponent(username)}`,
    );
    const list = Array.isArray(check.data)
      ? check.data
      : Array.isArray(check.data?.data)
        ? check.data.data
        : [];
    const taken = list.some(
      (item: { id?: number | string; username?: string }) =>
        String(item.id) !== String(user?.id) &&
        item.username?.toLowerCase() === username.toLowerCase(),
    );
    if (taken) {
      setSaving(false);
      showError("Bu kullanıcı adı zaten alınmış");
      return;
    }

    const ok = await patchUser({ username });
    setSaving(false);
    if (ok) closeModal();
  };

  const saveGender = async () => {
    if (!draft) {
      showError("Cinsiyet seçiniz");
      return;
    }
    setSaving(true);
    const ok = await patchUser({ gender: draft });
    setSaving(false);
    if (ok) closeModal();
  };

  const saveBirthday = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft)) {
      showError("Geçerli bir tarih seçiniz");
      return;
    }
    setSaving(true);
    const ok = await patchUser({ birthday: draft });
    setSaving(false);
    if (ok) closeModal();
  };

  const saveImage = async (uri: string) => {
    if (uploadingRef.current) return;
    uploadingRef.current = true;
    setSaving(true);

    const upload = await postData(uri, `avatar_${Date.now()}.jpg`);
    const uploaded = Array.isArray(upload.data) ? upload.data[0] : upload.data;

    if (!upload.status || !uploaded?.id) {
      uploadingRef.current = false;
      setSaving(false);
      setPendingImageUpload(false);
      showError(upload.error || "Görsel yüklenemedi");
      return;
    }

    const extra = {
      image: {
        id: uploaded.id,
        url: uploaded.url,
      },
    };
    const ok = await patchUser({ image: uploaded.id }, extra);
    clearImage();
    uploadingRef.current = false;
    setSaving(false);
    setPendingImageUpload(false);
    if (ok) closeModal();
  };

  useEffect(() => {
    if (!pendingImageUpload || !image?.uri) return;
    void saveImage(image.uri);
  }, [image?.uri, pendingImageUpload]);

  useEffect(() => {
    if (!isOpenCamera && pendingImageUpload && !image?.uri) {
      setPendingImageUpload(false);
    }
  }, [isOpenCamera, pendingImageUpload, image?.uri]);

  const openEdit = (field: EditableField) => {
    setFormError("");
    if (field === "username") setDraft(user?.username ?? "");
    if (field === "gender") setDraft(user?.gender ?? "");
    if (field === "birthday") {
      const parsed = parseIsoDate(user?.birthday);
      setDraft(toIsoDate(parsed.year, parsed.month, parsed.day));
    }
    if (field === "image") {
      clearImage();
      setDraft("");
    }
    setEditingField(field);
  };

  const openCamera = () => {
    setPendingImageUpload(true);
    closeModal();
    setIsOpenCamera(true);
  };

  const handleSave = () => {
    if (editingField === "username") return saveUsername();
    if (editingField === "gender") return saveGender();
    if (editingField === "birthday") return saveBirthday();
  };

  const avatarUrl = getUserImageUrl(user?.image);
  const initials =
    (user?.username?.charAt(0) || "") + (user?.username?.charAt(1) || "");

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.avatarEdit}
            onPress={() => openEdit("image")}
          >
            <Feather name="edit-2" size={14} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerName} numberOfLines={1}>
          {user?.username || "Kullanıcı"}
        </Text>
        <Text style={styles.headerEmail} numberOfLines={1}>
          {user?.email || ""}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <FieldRow
            label="Kullanıcı adı"
            value={user?.username || "-"}
            onEdit={() => openEdit("username")}
            styles={styles}
            theme={theme}
          />
          <FieldRow
            label="E-posta"
            value={user?.email || "-"}
            styles={styles}
            theme={theme}
          />
          <FieldRow
            label="Dil"
            value={user?.language || "-"}
            styles={styles}
            theme={theme}
          />
          <FieldRow
            label="Cinsiyet"
            value={genderLabel(user?.gender)}
            onEdit={() => openEdit("gender")}
            styles={styles}
            theme={theme}
          />
          <FieldRow
            label="Doğum tarihi"
            value={formatBirthday(user?.birthday)}
            onEdit={() => openEdit("birthday")}
            styles={styles}
            theme={theme}
            last
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={editingField !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingField === "username"
                  ? "Kullanıcı adını düzenle"
                  : editingField === "gender"
                    ? "Cinsiyet"
                    : editingField === "birthday"
                      ? "Doğum tarihi"
                      : "Profil fotoğrafı"}
              </Text>

              {editingField === "username" && (
                <TextInput
                  style={[styles.input, formError ? styles.inputError : null]}
                  value={draft}
                  onChangeText={(text) => {
                    setFormError("");
                    setDraft(text);
                  }}
                  autoCapitalize="none"
                  placeholder="Kullanıcı adı"
                  placeholderTextColor={theme.text_40}
                />
              )}

              {editingField === "birthday" && (
                <TurkishDatePicker
                  value={draft}
                  onChange={setDraft}
                  styles={styles}
                  theme={theme}
                />
              )}

              {editingField === "gender" && (
                <View style={styles.optionList}>
                  {GENDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.option,
                        draft === option.value && styles.optionActive,
                      ]}
                      onPress={() => setDraft(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          draft === option.value && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {editingField === "image" && (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={openCamera}
                >
                  <Feather name="camera" size={18} color={theme.white} />
                  <Text style={styles.cameraButtonText}>Kamerayı aç</Text>
                </TouchableOpacity>
              )}

              {formError ? (
                <Text style={styles.formError}>{formError}</Text>
              ) : null}

              {editingField !== "image" && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color={theme.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Kaydet</Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelText}>Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {saving && editingField === null && pendingImageUpload && (
        <View style={styles.uploadingOverlay} pointerEvents="none">
          <ActivityIndicator color={theme.white} />
          <Text style={styles.uploadingText}>Fotoğraf yükleniyor...</Text>
        </View>
      )}
    </View>
  );
};

type Theme = ReturnType<typeof useTheme>;
type Styles = ReturnType<typeof createStyles>;

const TurkishDatePicker = ({
  value,
  onChange,
  styles,
  theme,
}: {
  value: string;
  onChange: (iso: string) => void;
  styles: Styles;
  theme: Theme;
}) => {
  const parsed = parseIsoDate(value);
  const maxDay = daysInMonth(parsed.year, parsed.month);
  const days = Array.from({ length: maxDay }, (_, index) => index + 1);
  const day = Math.min(parsed.day, maxDay);

  const emit = (year: number, month: number, nextDay: number) => {
    const clamped = Math.min(nextDay, daysInMonth(year, month));
    onChange(toIsoDate(year, month, clamped));
  };

  return (
    <View>
      <Text style={styles.datePreview}>{formatBirthdayLong(toIsoDate(parsed.year, parsed.month, day))}</Text>
      <View style={styles.pickerRow}>
        <WheelColumn
          label="Gün"
          data={days}
          value={day}
          onChange={(next) => emit(parsed.year, parsed.month, next)}
          format={(item) => pad2(item)}
          styles={styles}
          theme={theme}
        />
        <WheelColumn
          label="Ay"
          data={MONTHS_TR.map((_, index) => index + 1)}
          value={parsed.month}
          onChange={(next) => emit(parsed.year, next, day)}
          format={(item) => MONTHS_TR[item - 1]}
          styles={styles}
          theme={theme}
          flex={1.45}
        />
        <WheelColumn
          label="Yıl"
          data={YEARS}
          value={parsed.year}
          onChange={(next) => emit(next, parsed.month, day)}
          format={(item) => String(item)}
          styles={styles}
          theme={theme}
        />
      </View>
      <Text style={styles.hint}>Tarih gün.ay.yıl sırasıyla seçilir</Text>
    </View>
  );
};

const WheelColumn = ({
  label,
  data,
  value,
  onChange,
  format,
  styles,
  theme,
  flex = 1,
}: {
  label: string;
  data: number[];
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  styles: Styles;
  theme: Theme;
  flex?: number;
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(
    0,
    data.findIndex((item) => item === value),
  );

  const selectFromOffset = (offsetY: number) => {
    const index = Math.round(offsetY / PICKER_ITEM_HEIGHT);
    const next = data[Math.max(0, Math.min(data.length - 1, index))];
    if (next !== undefined && next !== value) onChange(next);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * PICKER_ITEM_HEIGHT,
        animated: false,
      });
    });
  }, [selectedIndex, data.length]);

  return (
    <View style={[styles.wheelColumn, { flex }]}>
      <Text style={styles.wheelLabel}>{label}</Text>
      <View style={styles.wheelWindow}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={PICKER_ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          nestedScrollEnabled
          onMomentumScrollEnd={(event) =>
            selectFromOffset(event.nativeEvent.contentOffset.y)
          }
          onScrollEndDrag={(event) =>
            selectFromOffset(event.nativeEvent.contentOffset.y)
          }
          contentContainerStyle={{
            paddingVertical: PICKER_ITEM_HEIGHT * Math.floor(PICKER_VISIBLE / 2),
          }}
        >
          {data.map((item) => (
            <Pressable
              key={`${label}-${item}`}
              style={styles.wheelItem}
              onPress={() => onChange(item)}
            >
              <Text
                style={[
                  styles.wheelItemText,
                  item === value && {
                    color: theme.primary,
                    fontFamily: "Poppins_600SemiBold",
                  },
                ]}
                numberOfLines={1}
              >
                {format(item)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View pointerEvents="none" style={styles.wheelHighlight} />
      </View>
    </View>
  );
};

const FieldRow = ({
  label,
  value,
  onEdit,
  last,
  styles,
  theme,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  last?: boolean;
  styles: ReturnType<typeof createStyles>;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={[styles.row, last && styles.rowLast]}>
    <View style={styles.rowText}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
    {onEdit ? (
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Feather name="edit-2" size={16} color={theme.primary} />
      </TouchableOpacity>
    ) : null}
  </View>
);

export default Personal;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      paddingTop: inset.top ? inset.top + 8 : 16,
      paddingBottom: 28,
      paddingHorizontal: 24,
      alignItems: "center",
    },
    headerTitle: {
      ...Fonts.S16W600,
      color: theme.white,
      marginBottom: 16,
    },
    headerName: {
      ...Fonts.S18W600,
      color: theme.white,
      marginTop: 12,
    },
    headerEmail: {
      ...Fonts.S14W400,
      color: theme.white_70,
      marginTop: 2,
    },
    scroll: {
      padding: 16,
      paddingBottom: (inset.bottom ?? 0) + 88,
    },
    avatarWrap: {
      width: 112,
      height: 112,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarRing: {
      width: 112,
      height: 112,
      borderRadius: 56,
      borderWidth: 3,
      borderColor: theme.white,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    avatar: {
      width: 106,
      height: 106,
      borderRadius: 53,
      backgroundColor: theme.primary_10,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: 106,
      height: 106,
    },
    avatarInitials: {
      ...Fonts.S16W600,
      fontSize: 28,
      color: theme.primary,
      textTransform: "uppercase",
    },
    avatarEdit: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.white,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      backgroundColor: theme.white,
      borderRadius: 16,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.text_10,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    rowLabel: {
      ...Fonts.S12W400,
      color: theme.text_50,
    },
    rowValue: {
      ...Fonts.S14W500,
      color: theme.text,
    },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary_10,
      alignItems: "center",
      justifyContent: "center",
    },
    logoutButton: {
      marginTop: 24,
      height: 52,
      borderRadius: 14,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    logoutText: {
      ...Fonts.S16W600,
      color: theme.white,
    },
    modalRoot: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "#00000066",
    },
    modalCard: {
      backgroundColor: theme.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: (inset.bottom ?? 0) + 20,
    },
    modalTitle: {
      ...Fonts.S16W600,
      color: theme.text,
      marginBottom: 16,
    },
    input: {
      ...Fonts.S14W400,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary_20,
      backgroundColor: theme.primary_10,
      paddingHorizontal: 14,
      color: theme.text,
    },
    inputError: {
      borderColor: theme.danger,
      backgroundColor: theme.danger_10,
    },
    formError: {
      ...Fonts.S12W500,
      color: theme.danger,
      marginTop: 10,
      textAlign: "center",
    },
    hint: {
      ...Fonts.S12W400,
      color: theme.text_40,
      marginTop: 8,
      textAlign: "center",
    },
    datePreview: {
      ...Fonts.S16W600,
      color: theme.primary,
      textAlign: "center",
      marginBottom: 12,
    },
    pickerRow: {
      flexDirection: "row",
      gap: 8,
    },
    wheelColumn: {
      flex: 1,
    },
    wheelLabel: {
      ...Fonts.S12W400,
      color: theme.text_50,
      textAlign: "center",
      marginBottom: 6,
    },
    wheelWindow: {
      height: PICKER_ITEM_HEIGHT * PICKER_VISIBLE,
      overflow: "hidden",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary_20,
      backgroundColor: theme.primary_10,
    },
    wheelHighlight: {
      position: "absolute",
      top: PICKER_ITEM_HEIGHT * Math.floor(PICKER_VISIBLE / 2),
      left: 4,
      right: 4,
      height: PICKER_ITEM_HEIGHT,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: theme.primary,
      backgroundColor: "transparent",
    },
    wheelItem: {
      height: PICKER_ITEM_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    wheelItemText: {
      ...Fonts.S14W500,
      color: theme.text_50,
    },
    optionList: {
      gap: 8,
    },
    option: {
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary_20,
      justifyContent: "center",
      paddingHorizontal: 14,
    },
    optionActive: {
      backgroundColor: theme.primary_10,
      borderColor: theme.primary,
    },
    optionText: {
      ...Fonts.S14W500,
      color: theme.text,
    },
    optionTextActive: {
      color: theme.primary,
    },
    saveButton: {
      marginTop: 16,
      height: 48,
      borderRadius: 12,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      ...Fonts.S16W600,
      color: theme.white,
    },
    cameraButton: {
      height: 48,
      borderRadius: 12,
      backgroundColor: theme.secondary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    cameraButtonText: {
      ...Fonts.S14W600,
      color: theme.white,
    },
    cancelButton: {
      marginTop: 10,
      alignItems: "center",
      paddingVertical: 8,
    },
    cancelText: {
      ...Fonts.S14W500,
      color: theme.text_50,
    },
    uploadingOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "#00000066",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    uploadingText: {
      ...Fonts.S14W500,
      color: theme.white,
    },
  });
