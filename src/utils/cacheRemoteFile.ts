import { Directory, File, Paths } from "expo-file-system";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

const AUDIO_DIR_NAME = "audio";

const toSafeFileName = (remoteUrl: string) => {
  try {
    const { pathname } = new URL(remoteUrl);
    const base = pathname.split("/").filter(Boolean).join("_") || "audio";
    return base.replace(/[^a-zA-Z0-9._-]/g, "_");
  } catch {
    return remoteUrl.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "audio";
  }
};

const getAudioDirectory = () => {
  const dir = new Directory(Paths.document, AUDIO_DIR_NAME);
  if (!dir.exists) {
    dir.create();
  }
  return dir;
};

export const getCachedRemoteFile = async (
  remoteUrl: string,
): Promise<string> => {
  if (Platform.OS === "web") {
    return remoteUrl;
  }

  const dest = new File(getAudioDirectory(), toSafeFileName(remoteUrl));

  if (dest.exists && dest.size > 0) {
    return dest.uri;
  }

  if (dest.exists) {
    dest.delete();
  }

  const downloaded = await File.downloadFileAsync(remoteUrl, dest);
  return downloaded.uri;
};

export const useCachedRemoteFile = (remoteUrl?: string | null) => {
  const [uri, setUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!remoteUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!remoteUrl) {
      setUri(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getCachedRemoteFile(remoteUrl)
      .then((localUri) => {
        if (!cancelled) {
          setUri(localUri);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setUri(remoteUrl);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [remoteUrl]);

  return { uri, isLoading, error };
};
