import { FollowType } from "@/types";

export const followCalculate = (
  level: any,
  cource: any,
  exercise: any,
  follows: FollowType | undefined,
) => {
  const newLevel = Number(level || 1) * 100;
  const newCource = Number(cource || 1) * 10;
  const newExercise = Number(exercise || 1);

  const newUserLevel = Number(follows?.level || 1) * 100;
  const newUserCource = Number(follows?.cource || 1) * 10;
  const newUserExercise = Number(follows?.exercise || 1);

  return (
    newLevel + newCource + newExercise >
    newUserLevel + newUserCource + newUserExercise + 1
  );
};
