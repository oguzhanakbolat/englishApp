import { post } from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import { isOnline } from "@/utils/network";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PointCalculatorType = {
  points: number;
  percentage: number;
};

const pointCalculator = (
  answer: any,
  level: number,
  lesson: number,
  exerciseId: number,
  user: UserType,
  type: "words" | "exercises" | "patterns" = "exercises",
) => {
  console.log({ type });
  let points = 0;
  const idList: number[] = [];
  const uniqueIdList: number[] = [];
  let correct = 0;
  let wrong = 0;

  answer.forEach((item: any) => {
    if (type === "words") {
      if (item.correct) {
        points += 10;
      }
    } else {
      idList.push(item.questionId);

      const idCount = idList.filter(
        (id: number) => id === item.questionId,
      ).length;

      if (!uniqueIdList.includes(item.questionId)) {
        uniqueIdList.push(item.questionId);
      }

      if (item.correct) {
        correct++;
      } else {
        wrong++;
      }

      if (item.correct) {
        points += 60 / idCount;
      }
    }
  });

  const percentage =
    type === "words"
      ? (points * 10) / answer.length
      : (100 * uniqueIdList.length) / answer.length;

  void (async () => {
    if (!(await isOnline())) {
      const points = await AsyncStorage.getItem("points");

      const pointsData = [
        ...(points ? JSON.parse(points) : []),
        {
          language: user.language,
          cource: lesson.toString(),
          user: user.id,
          exercises: exerciseId.toString(),
          point: points,
          level: level.toString(),
          current: correct,
          wrong,
          answer: type === "words" ? {} : answer,
        },
      ];

      await AsyncStorage.setItem("points", JSON.stringify(pointsData));
    } else {
      await post("/exercises", {
        data: {
          language: user.language,
          cource: lesson.toString(),
          user: user.id,
          exercises: exerciseId.toString(),
          point: points,
          level: level.toString(),
          current: correct,
          wrong,
          answer: type === "words" ? {} : answer,
        },
      });
    }

    const followsPoint = level * 100 + lesson * 10 + exerciseId + 1;
    const followsUserPoint =
      Number(user?.follows?.level ?? 1) * 100 +
      Number(user?.follows?.cource ?? 1) * 10 +
      Number(user?.follows?.exercise ?? 1);

    if (
      followsPoint > followsUserPoint &&
      user.type === "outside" &&
      percentage >= 60
    ) {
      if (await isOnline()) {
        await post("/follows", {
          data: {
            user: user.id,
            language: user.language,
            level: level.toString(),
            cource: lesson.toString(),
            exercise: exerciseId.toString(),
          },
        });

        useUserStore.getState().setFollows({
          cource: lesson.toString(),
          exercise: exerciseId.toString(),
          level: level.toString(),
        });
      } else {
        const follows = await AsyncStorage.getItem("follows");
        const followsData = JSON.parse(follows || "{}");

        const followsAsyncStorage =
          Number(followsData.level) * 100 +
          Number(followsData.cource) * 10 +
          Number(followsData.exercise);

        if (followsAsyncStorage < followsPoint) {
          await AsyncStorage.setItem(
            "follows",
            JSON.stringify({
              user: user.id,
              language: user.language,
              level: level.toString(),
              cource: lesson.toString(),
              exercise: exerciseId.toString(),
            }),
          );
        }
      }
    }
  })();

  return {
    points: points,
    percentage,
  };
};

export default pointCalculator;
