import { ExerciseType } from "@/data";

export type PointCalculatorType = {
  points: number;
  totalPoints: number;
  percentage: number;
};

const pointCalculator = (exercise: ExerciseType, count: number) => {
  let points = 0;
  exercise?.questions?.forEach((question, index) => {
    if (index > count - 1) {
      points += 50;
    } else {
      points += 100;
    }
  });
  return {
    points,
    totalPoints: count * 100,
    percentage: (points / (count * 100)) * 100,
  };
};

export default pointCalculator;
