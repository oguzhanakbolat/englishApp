export type CompanyType = {
  id: string;
  name: string;
  taxNumber: string;
  taxOffice: string;
};

export type AddressType = {
  id: string;
  address: string;
  postCode: string;
};

export type ImageType = {
  id?: number;
  url: string;
};

export type FollowType = {
  cource: string;
  exercise: string;
  level: string;
};

export type UserType = {
  id: string | number;
  type: "outside" | "inside" | "teacher";
  language: string;
  image?: ImageType | string;
  username: string;
  email: string;
  gender?: string;
  birthday?: string;
  phone: string;
  company: CompanyType;
  address: AddressType;
  follows: FollowType;
};

export type IconType = {
  name: string;
  size?: number;
  color?: string;
};

export type QuestionType = {
  id?: number;
  question?: string | string[];
  text?: string;
  starttime?: string;
  endtime?: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  isCorrect?: string;
  answer?: string | string[];
};

export type WordType = {
  id: number;
  word: string;
  translate: string;
};

export type ExerciseType = {
  id: number;
  type:
    | "audio"
    | "multiple-choice"
    | "fill-in-the-blank"
    | "write"
    | "listenAndSpeak"
    | "ListenAndSpeak";
  file?: string;
  speakFile?: string | ImageType;
  url?: number | string;
  description?: string;
  text?: {
    id: number;
    who: string;
    text: string;
  }[];
  questions?: QuestionType[];
};

export type PatternType = {
  id: number;
  type: "subject" | "multiple-choice" | "fill-in-the-blank" | "write";
  text: string;
  isChange: boolean;
  changeList: string[];
  wordList: string[];
};

export type LessonType = {
  id: number;
  title: string;
  exercises: ExerciseType[];
  words: WordType[];
};

export type LevelDataType = {
  id: number;
  title: string;
  lessons: LessonType[];
};

export type LessonDataType = {
  id: number;
  title: string;
  levels: LevelDataType[];
};

export type AnswerType = {
  id: number;
  questionId: number;
  answer: string;
  correct: boolean;
  error: boolean;
};
