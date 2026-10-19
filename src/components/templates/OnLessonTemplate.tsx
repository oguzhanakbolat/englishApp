import { useTheme } from "@/hooks/use-theme";
import { cdnURL } from "@/services/api";
import { ExerciseType } from "@/types";
import { useCachedRemoteFile } from "@/utils/cacheRemoteFile";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Insets, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Container from "../atoms/Container";
import FileLoading from "../organisms/FileLoading";
import FillInTheBlank from "../organisms/FillInTheBlank";
import Listen from "../organisms/Listen";
import ListenAndSpeak from "../organisms/ListenAndSpeak";
import MultiChoose from "../organisms/MultiChoose";
import Write from "../organisms/Write";

const toAbsoluteUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${cdnURL}${path.startsWith("/") ? path : `/${path}`}`;
};

const getMediaPath = (file?: unknown) => {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (typeof file !== "object") return null;
  const media = file as {
    url?: string;
    data?: { url?: string; attributes?: { url?: string } };
  };
  return media.url || media.data?.url || media.data?.attributes?.url || null;
};

const OnLessonTemplate = () => {
  const inset = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, inset), [theme, inset]);
  const { level, cource, exerciseId, data, file, speakFile } =
    useLocalSearchParams<{
      level: string;
      cource: string;
      exerciseId: string;
      data: string;
      file: string;
      speakFile: string;
    }>();

  const exercise = useMemo(
    () => JSON.parse(data ?? "{}") as ExerciseType,
    [data],
  );
  const router = useRouter();
  const isAudio = exercise?.type === "audio";
  const isListenAndSpeak = exercise?.type === "listenAndSpeak";

  const audioRemoteUrl = useMemo(
    () => (isAudio ? toAbsoluteUrl(file) : null),
    [isAudio, file],
  );
  const speakFileParam = Array.isArray(speakFile) ? speakFile[0] : speakFile;
  const speakRemoteUrl = useMemo(
    () =>
      isListenAndSpeak
        ? toAbsoluteUrl(speakFileParam || getMediaPath(exercise?.speakFile))
        : null,
    [isListenAndSpeak, speakFileParam, exercise],
  );

  const { uri: audioUri, isLoading: isAudioLoading } =
    useCachedRemoteFile(audioRemoteUrl);
  const { uri: speakFileUri, isLoading: isSpeakFileLoading } =
    useCachedRemoteFile(speakRemoteUrl);

  const handleBack = () => {
    router.back();
  };

  return (
    <Container
      title={"Egzersiz " + (exerciseId ?? "")}
      haveBottom={false}
      onBackControl={handleBack}
    >
      <View style={styles.container}>
        {(isAudio && isAudioLoading) ||
        (isListenAndSpeak && isSpeakFileLoading) ? (
          <FileLoading />
        ) : isAudio ? (
          <Listen
            exercise={exercise}
            level={Number(level) ?? 0}
            lesson={Number(cource) ?? 0}
            audioUri={audioUri}
          />
        ) : isListenAndSpeak ? (
          <ListenAndSpeak
            exercise={exercise}
            level={Number(level) ?? 0}
            lesson={Number(cource) ?? 0}
            audioUri={speakFileUri}
          />
        ) : exercise?.type === "multiple-choice" ? (
          <MultiChoose
            exercise={exercise}
            level={Number(level) ?? 0}
            lesson={Number(cource) ?? 0}
          />
        ) : exercise?.type === "write" ? (
          <Write
            exercise={exercise}
            level={Number(level) ?? 0}
            lesson={Number(cource) ?? 0}
          />
        ) : (
          <FillInTheBlank
            exercise={exercise}
            level={Number(level) ?? 0}
            lesson={Number(cource) ?? 0}
          />
        )}
      </View>
    </Container>
  );
};

export default OnLessonTemplate;

const createStyles = (theme: ReturnType<typeof useTheme>, inset: Insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
