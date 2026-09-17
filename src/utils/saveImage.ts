import { Directory, File, Paths } from "expo-file-system";

const IMAGES_DIR_NAME = "images";

// Images klasörünü al veya oluştur
const getImagesDirectory = (): Directory => {
  const imagesDir = new Directory(Paths.document, IMAGES_DIR_NAME);
  if (!imagesDir.exists) {
    imagesDir.create();
  }
  return imagesDir;
};

// Tek bir resmi kalıcı konuma kaydet
export const saveImagePermanently = async (
  uri: string,
  prefix: string = "image"
): Promise<string> => {
  try {
    const imagesDir = getImagesDirectory();

    // Zaten kalıcı konumdaysa, aynı URI'yi döndür
    if (uri.includes(IMAGES_DIR_NAME)) {
      return uri;
    }

    const fileName = `${prefix}_${Date.now()}.jpg`;
    const sourceFile = new File(uri);
    const destFile = new File(imagesDir, fileName);

    sourceFile.copy(destFile);

    return destFile.uri;
  } catch (error) {
    console.error("saveImagePermanently error:", error);
    return uri; // Hata durumunda orijinal URI'yi döndür
  }
};

// Birden fazla resmi kalıcı konuma kaydet
export const saveImagesPermanently = async (
  uris: string[],
  prefix: string = "image"
): Promise<string[]> => {
  const savedUris: string[] = [];

  for (let i = 0; i < uris.length; i++) {
    const savedUri = await saveImagePermanently(uris[i], `${prefix}_${i}`);
    savedUris.push(savedUri);
  }

  return savedUris;
};

// Tek bir dosyayı kalıcı konuma kaydet (uzantıyı korur)
export const saveFilePermanently = async (
  uri: string,
  prefix: string = "file"
): Promise<string> => {
  try {
    const imagesDir = getImagesDirectory();

    // Zaten kalıcı konumdaysa, aynı URI'yi döndür
    if (uri.includes(IMAGES_DIR_NAME)) {
      return uri;
    }

    // Orijinal dosya uzantısını al
    const originalExtension = uri.split(".").pop() || "dat";
    const fileName = `${prefix}_${Date.now()}.${originalExtension}`;
    const sourceFile = new File(uri);
    const destFile = new File(imagesDir, fileName);

    sourceFile.copy(destFile);

    return destFile.uri;
  } catch (error) {
    console.error("saveFilePermanently error:", error);
    return uri; // Hata durumunda orijinal URI'yi döndür
  }
};

// Resmi sil
export const deleteImage = (uri: string): boolean => {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
      return true;
    }
    return false;
  } catch (error) {
    console.error("deleteImage error:", error);
    return false;
  }
};

// Tüm kaydedilmiş resimleri temizle
export const clearAllImages = (): boolean => {
  try {
    const imagesDir = new Directory(Paths.document, IMAGES_DIR_NAME);
    if (imagesDir.exists) {
      imagesDir.delete();
    }
    return true;
  } catch (error) {
    console.error("clearAllImages error:", error);
    return false;
  }
};
