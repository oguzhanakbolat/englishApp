import { DataType } from "@/types/addCardType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pending_works";

export type PendingWork = {
  id: string;
  data: DataType;
  step: number;
  createdAt: string;
  updatedAt: string;
};

// Tüm bekleyen işleri getir
export const getPendingWorks = async (): Promise<PendingWork[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("getPendingWorks error:", error);
    return [];
  }
};

// Belirli bir işi getir
export const getPendingWorkById = async (
  id: string
): Promise<PendingWork | null> => {
  try {
    const works = await getPendingWorks();
    return works.find((work) => work.id === id) || null;
  } catch (error) {
    console.error("getPendingWorkById error:", error);
    return null;
  }
};

// Yeni iş ekle veya mevcut işi güncelle
export const savePendingWork = async (
  id: string,
  data: DataType,
  step: number
): Promise<boolean> => {
  try {
    const works = await getPendingWorks();
    const existingIndex = works.findIndex((work) => work.id === id);
    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      // Mevcut işi güncelle
      works[existingIndex] = {
        ...works[existingIndex],
        data,
        step,
        updatedAt: now,
      };
    } else {
      // Yeni iş ekle
      works.push({
        id,
        data,
        step,
        createdAt: now,
        updatedAt: now,
      });
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    return true;
  } catch (error) {
    console.error("savePendingWork error:", error);
    return false;
  }
};

// İşi sil (sunucuya başarıyla gönderildikten sonra)
export const deletePendingWork = async (id: string): Promise<boolean> => {
  try {
    const works = await getPendingWorks();
    const filteredWorks = works.filter((work) => work.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWorks));
    return true;
  } catch (error) {
    console.error("deletePendingWork error:", error);
    return false;
  }
};

// Tüm bekleyen işleri temizle
export const clearAllPendingWorks = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("clearAllPendingWorks error:", error);
    return false;
  }
};
