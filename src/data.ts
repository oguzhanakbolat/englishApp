export type QuestionType = {
  id: number;
  question: string | string[];
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
  type: "audio" | "multiple-choice" | "fill-in-the-blank" | "write";
  file?: string;
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

const LessonData: LessonDataType[] = [
  {
    id: 1,
    title: "English",
    levels: [
      {
        id: 1,
        title: "Seviye 1",
        lessons: [
          {
            id: 1,
            title: "Ders 1",
            exercises: [
              {
                id: 1,
                type: "audio",
                url: require("@/constants/level_1_1.mp3"),
                text: [
                  {
                    id: 1,
                    who: "A",
                    text: "Excuse me. Sorry. Do you speak English sir?",
                  },
                  {
                    id: 2,
                    who: "B",
                    text: "Yes, miss, I speak a little English.",
                  },
                  {
                    id: 3,
                    who: "A",
                    text: "Are you a foreigner?",
                  },
                  {
                    id: 4,
                    who: "B",
                    text: "Yes, I am Turk. Do you speak Turkish?",
                  },
                  {
                    id: 5,
                    who: "A",
                    text: "No, sir. I don't speak Turkish.",
                  },
                ],
              },
              {
                id: 2,
                type: "multiple-choice",
                description: "Aşağıdaki ifadelerin Türkçe karşılığını seçiniz.",
                questions: [
                  {
                    id: 1,
                    question: "Excuse me.",
                    a: "Üzgünüm.",
                    b: "Affedersiniz.",
                    c: "Lütfen.",
                    d: "Merhaba.",
                    isCorrect: "b",
                  },
                  {
                    id: 2,
                    question: "Sorry.",
                    a: "Affedersiniz.",
                    b: "Özür dilerim.",
                    c: "Üzgünüm.",
                    d: "Teşekkür ederim.",
                    isCorrect: "c",
                  },
                  {
                    id: 3,
                    question: "Do you speak English, sir?",
                    a: "İngilizce konuşuyor musunuz, hanımefendi?",
                    b: "İngilizce mi konuşuyorsunuz, beyefendi?",
                    c: "İngilizce konuşuyor musun, beyefendi?",
                    d: "İngilizce konuşuyor musunuz, beyefendi?",
                    isCorrect: "c",
                  },
                  {
                    id: 4,
                    question: "Yes, miss, I speak a little English.",
                    a: "Evet, hanımefendi, ben biraz İngilizce konuşuyorum.",
                    b: "Evet, beyefendi, ben biraz İngilizce konuşuyorum.",
                    c: "Evet, hanımefendi, siz biraz İngilizce konuşuyorsunuz.",
                    d: "Evet, hanımefendi, ben çok İngilizce konuşuyorum.",
                    isCorrect: "a",
                  },
                  {
                    id: 5,
                    question: "Are you a foreigner?",
                    a: "Yabancı mıyım?",
                    b: "Yabancı mısınız?",
                    c: "Yabancı mı?",
                    d: "Yabancı değil misiniz?",
                    isCorrect: "b",
                  },
                  {
                    id: 6,
                    question: "Yes, I am Turk.",
                    a: "Evet, o Türk.",
                    b: "Evet, ben Türk değilim.",
                    c: "Evet, ben Türküm.",
                    d: "Evet, ben bir Türk'üm.",
                    isCorrect: "c",
                  },
                  {
                    id: 7,
                    question: "Do you speak Turkish?",
                    a: "Türkçe biliyor musunuz?",
                    b: "Türkçe konuşuyor musun?",
                    c: "Türkçe mi konuşuyorsunuz?",
                    d: "Türkçe konuşuyor musunuz?",
                    isCorrect: "d",
                  },
                  {
                    id: 8,
                    question: "No, sir. I don't speak Turkish.",
                    a: "Hayır, hanımefendi. Ben Türkçe konuşmuyorum.",
                    b: "Evet, beyefendi. Ben Türkçe konuşuyorum.",
                    c: "Hayır, beyefendi. Ben Türkçe bilmiyorum.",
                    d: "Hayır, beyefendi. Ben Türkçe konuşmuyorum.",
                    isCorrect: "d",
                  },
                  {
                    id: 9,
                    question: "I am a foreigner.",
                    a: "Ben yabancıyım.",
                    b: "Ben bir yabancıyım.",
                    c: "Ben bir yabancı değilim.",
                    d: "Sen bir yabancısın.",
                    isCorrect: "b",
                  },
                  {
                    id: 10,
                    question: "Are you a foreigner?",
                    a: "Sen bir yabancı mısın?",
                    b: "Siz bir yabancı mısınız?",
                    c: "Ben bir yabancı mıyım?",
                    d: "Sen bir yabancı değil misin?",
                    isCorrect: "b",
                  },
                ],
              },
              {
                id: 3,
                type: "multiple-choice",
                description:
                  "Aşağıdaki ifadelerin İngilizce karşılığını seçiniz.",
                questions: [
                  {
                    id: 1,
                    question: "Affedersiniz.",
                    a: "Sorry.",
                    b: "Please.",
                    c: "Hello.",
                    d: "Excuse me.",
                    isCorrect: "d",
                  },
                  {
                    id: 2,
                    question: "Üzgünüm.",
                    a: "Excuse me.",
                    b: "Goodbye.",
                    c: "Sorry.",
                    d: "Thank you.",
                    isCorrect: "c",
                  },
                  {
                    id: 3,
                    question: "İngilizce konuşuyor musunuz, beyefendi?",
                    a: "Do you speak English miss?",
                    b: "Do you know English sir?",
                    c: "Are you speaking English sir?",
                    d: "Do you speak English sir?",
                    isCorrect: "d",
                  },
                  {
                    id: 4,
                    question:
                      "Evet, hanımefendi, ben biraz İngilizce konuşuyorum.",
                    a: "Yes, sir, I speak a little English.",
                    b: "Yes, miss, you speak a little English.",
                    c: "Yes, miss, I speak a little English.",
                    d: "Yes, miss, I speak much English.",
                    isCorrect: "c",
                  },
                  {
                    id: 5,
                    question: "Yabancı mısınız?",
                    a: "Am I a foreigner?",
                    b: "Are you not a foreigner?",
                    c: "Are you a foreigner?",
                    d: "Is he a foreigner?",
                    isCorrect: "c",
                  },
                  {
                    id: 6,
                    question: "Evet, ben Türküm.",
                    a: "Yes, he is Turk.",
                    b: "Yes, I am a Turk.",
                    c: "Yes, I am Turkish.",
                    d: "Yes, I am Turk.",
                    isCorrect: "d",
                  },
                  {
                    id: 7,
                    question: "Türkçe konuşuyor musunuz?",
                    a: "Are you speaking Turkish?",
                    b: "Do you know Turkish?",
                    c: "Do you speak English?",
                    d: "Do you speak Turkish?",
                    isCorrect: "d",
                  },
                  {
                    id: 8,
                    question: "Hayır, beyefendi. Ben Türkçe konuşmuyorum.",
                    a: "No, miss. I don't speak Turkish.",
                    b: "Yes, sir. I don't speak Turkish.",
                    c: "No, sir. I don't know Turkish.",
                    d: "No, sir. I don't speak Turkish.",
                    isCorrect: "d",
                  },
                  {
                    id: 9,
                    question: "Ben bir yabancıyım.",
                    a: "I am not a foreigner.",
                    b: "You are a foreigner.",
                    c: "I am foreigner.",
                    d: "I am a foreigner.",
                    isCorrect: "bd",
                  },
                  {
                    id: 10,
                    question: "Siz bir yabancı mısınız?",
                    a: "Is he a foreigner?",
                    b: "Are you a foreigner?",
                    c: "Am I a foreigner?",
                    d: "Are you not a foreigner?",
                    isCorrect: "b",
                  },
                ],
              },
              {
                id: 4,
                type: "multiple-choice",
                description:
                  "Yeni kelimeler öğrenin Türkçe cümlelerin İngilizce karşılığını seçiniz.",
                questions: [
                  {
                    id: 1,
                    question: "Ben bir yabancıyım.",
                    a: "You are a foreigner.",
                    b: "I am not a foreigner.",
                    c: "I am foreigner.",
                    d: "I am a foreigner.",
                    isCorrect: "d",
                  },
                  {
                    id: 2,
                    question: "Siz bir yabancısınız.",
                    a: "You are a foreigner.",
                    b: "Are you a foreigner?",
                    c: "I am a foreigner.",
                    d: "You are not a foreigner.",
                    isCorrect: "a",
                  },
                  {
                    id: 3,
                    question: "Ben bir yabancı mıyım?",
                    a: "Am I a foreigner?",
                    b: "Are you a foreigner?",
                    c: "Is he a foreigner?",
                    d: "Am I not a foreigner?",
                    isCorrect: "d",
                  },
                  {
                    id: 4,
                    question: "Siz bir yabancı mısınız?",
                    a: "Is she a foreigner?",
                    b: "Are you a foreigner?",
                    c: "Am I a foreigner?",
                    d: "Are you not a foreigner?",
                    isCorrect: "b",
                  },
                  {
                    id: 5,
                    question: "Ben bir yabancı değilim.",
                    a: "I am a foreigner.",
                    b: "Am I not a foreigner?",
                    c: "I am not a foreigner.",
                    d: "You are not a foreigner.",
                    isCorrect: "c",
                  },
                  {
                    id: 6,
                    question: "Siz bir yabancı değilsiniz.",
                    a: "Are you not a foreigner?",
                    b: "I am not a foreigner.",
                    c: "You are a foreigner.",
                    d: "You are not a foreigner.",
                    isCorrect: "d",
                  },
                  {
                    id: 7,
                    question: "Ben bir yabancı değil miyim?",
                    a: "Am I not a foreigner?",
                    b: "Are you not a foreigner?",
                    c: "I am not a foreigner.",
                    d: "Am I a foreigner?",
                    isCorrect: "a",
                  },
                  {
                    id: 8,
                    question: "Siz bir yabancı değil misiniz?",
                    a: "Is he not a foreigner?",
                    b: "Aren't you a foreigner?",
                    c: "Are you a foreigner?",
                    d: "Am I not a foreigner?",
                    isCorrect: "b",
                  },
                  {
                    id: 9,
                    question: "Ben İngilizce konuşuyorum.",
                    a: "You speak English.",
                    b: "Do I speak English?",
                    c: "I speak English.",
                    d: "I don't speak English.",
                    isCorrect: "c",
                  },
                  {
                    id: 10,
                    question: "Siz İngilizce konuşuyorsunuz.",
                    a: "Do you speak English?",
                    b: "I speak English.",
                    c: "You don't speak English.",
                    d: "You speak English.",
                    isCorrect: "d",
                  },
                  {
                    id: 11,
                    question: "Ben İngilizce konuşuyor muyum?",
                    a: "Do I speak English?",
                    b: "Don't I speak English?",
                    c: "Am I speaking English?",
                    d: "Do you speak English?",
                    isCorrect: "a",
                  },
                  {
                    id: 12,
                    question: "Siz İngilizce konuşuyor musunuz?",
                    a: "Do you speak English?",
                    b: "Don't you speak English?",
                    c: "Are you speaking English?",
                    d: "Do I speak English?",
                    isCorrect: "a",
                  },
                  {
                    id: 13,
                    question: "Ben İngilizce konuşmuyorum.",
                    a: "I can't speak English.",
                    b: "I don't know English.",
                    c: "I am not speaking English.",
                    d: "I don't speak English.",
                    isCorrect: "d",
                  },
                  {
                    id: 14,
                    question: "Siz İngilizce konuşmuyorsunuz.",
                    a: "I don't speak English.",
                    b: "You don't speak English.",
                    c: "Don't you speak English?",
                    d: "You don't know English.",
                    isCorrect: "b",
                  },
                  {
                    id: 15,
                    question: "Ben İngilizce konuşmuyor muyum?",
                    a: "Am I not speaking English?",
                    b: "Do you speak English?",
                    c: "Do I speak English?",
                    d: "Don't I speak English?",
                    isCorrect: "d",
                  },
                  {
                    id: 16,
                    question: "Siz İngilizce konuşmuyor musunuz?",
                    a: "Don't you speak English?",
                    b: "Are you not speaking English?",
                    c: "Do you speak English?",
                    d: "Don't I speak English?",
                    isCorrect: "a",
                  },
                  {
                    id: 17,
                    question: "Ben Amerikalıyım.",
                    a: "I am an American.",
                    b: "You are American.",
                    c: "I am American.",
                    d: "Am I American?",
                    isCorrect: "c",
                  },
                  {
                    id: 18,
                    question: "Siz Amerikalı mısınız?",
                    a: "Is he American?",
                    b: "Are you American?",
                    c: "Am I American?",
                    d: "Are you not American?",
                    isCorrect: "b",
                  },
                  {
                    id: 19,
                    question: "Siz İtalyanca konuşuyor musunuz?",
                    a: "Do you speak Italian?",
                    b: "Don't you speak Italian?",
                    c: "Are you speaking Italian?",
                    d: "Do you speak English?",
                    isCorrect: "a",
                  },
                  {
                    id: 20,
                    question: "Siz Almanca konuşuyor musunuz?",
                    a: "Do you speak German?",
                    b: "Don't you speak German?",
                    c: "Are you speaking German?",
                    d: "Do you speak German?",
                    isCorrect: "a",
                  },
                  {
                    id: 21,
                    question: "Siz Fransızca konuşmuyor musunuz?",
                    a: "Do you speak French?",
                    b: "Are you speaking French?",
                    c: "Don't you speak French?",
                    d: "You don't speak French?",
                    isCorrect: "c",
                  },
                ],
              },
              {
                id: 5,
                type: "fill-in-the-blank",
                description:
                  "Aşağıdaki cümlelerde boş bırakılan yerleri doldurunuz.",
                questions: [
                  {
                    id: 1,
                    question: ["I", "a foreigner."],
                    a: "am",
                    b: "is",
                    c: "are",
                    isCorrect: "a",
                  },
                  {
                    id: 2,
                    question: ["", "you speak English?"],
                    a: "Do",
                    b: "Are",
                    c: "Is",
                    isCorrect: "a",
                  },
                  {
                    id: 3,
                    question: ["She", "a teacher."],
                    a: "am",
                    b: "is",
                    c: "are",
                    isCorrect: "b",
                  },
                  {
                    id: 4,
                    question: ["I", "speak Turkish."],
                    a: "don't",
                    b: "am not",
                    c: "doesn't",
                    isCorrect: "a",
                  },
                  {
                    id: 5,
                    question: ["", "I a foreigner."],
                    a: "am",
                    b: "is",
                    c: "are",
                    isCorrect: "a",
                  },
                ],
              },
              {
                id: 6,
                type: "write",
                description: "Aşağıdaki cümlenin negatif halini yazınız.",
                questions: [
                  {
                    id: 1,
                    question: "I speak English.",
                    answer: [
                      "I don't speak English.",
                      "I do not speak English.",
                    ],
                  },
                  {
                    id: 2,
                    question: "You are a foreigner.",
                    answer: [
                      "You aren't a foreigner.",
                      "You are not a foreigner.",
                    ],
                  },
                  {
                    id: 3,
                    question: "Do you speak English?",
                    answer: [
                      "Don't you speak English?",
                      "Do you not speak English.",
                    ],
                  },
                  {
                    id: 4,
                    question: "You speak Turkish.",
                    answer: [
                      "You do not speak Turkish.",
                      "You don't speak Turkish.",
                    ],
                  },
                  {
                    id: 5,
                    question: "Are you American?",
                    answer: ["Aren't you American?", "Are you not American?"],
                  },
                  {
                    id: 6,
                    question: "You are British.",
                    answer: ["You aren't British.", "You are not British."],
                  },
                  {
                    id: 7,
                    question: "Am I a Foreigner?",
                    answer: ["Am I not a Foreigner?"],
                  },
                ],
              },
              {
                id: 7,
                type: "write",
                description: "Aşağıdaki cümlelerin soru halini yazınız.",
                questions: [
                  {
                    id: 1,
                    question: "I am a foreigner.",
                    answer: ["Am I a foreigner?"],
                  },
                  {
                    id: 2,
                    question: "You speak English.",
                    answer: ["Do you speak English?"],
                  },
                  {
                    id: 3,
                    question: "You aren't Turk.",
                    answer: ["Aren't you a Turk?", "Are you not a Turk?"],
                  },
                  {
                    id: 4,
                    question: "You don't speak French.",
                    answer: ["Do you not speak French?"],
                  },
                ],
              },
              {
                id: 8,
                type: "write",
                description: "Aşağıdaki cümleleri ingilizceye çeviriniz.",
                questions: [
                  {
                    id: 1,
                    question: "Ben bir yabancıyım.",
                    answer: ["I am a foreigner.", "I'm a foreigner."],
                  },
                  {
                    id: 2,
                    question: "Siz İngilizce konuşuyor musunuz?",
                    answer: ["Do you speak English."],
                  },
                  {
                    id: 3,
                    question: "Ben Türkçe konuşmuyorum.",
                    answer: [
                      "I don't speak Turkish.",
                      "I do not speak Turkish.",
                    ],
                  },
                  {
                    id: 4,
                    question: "Siz bir yabancı değil misiniz?",
                    answer: [
                      "Are you not a foreigner?",
                      "Aren't you a foreigner?",
                    ],
                  },
                ],
              },
              {
                id: 9,
                type: "write",
                description:
                  "Aşağıdaki hatalı cümlelerin doğru halini yazınız.",
                questions: [
                  {
                    id: 1,
                    question: "I is a foreigner.",
                    answer: ["I am a foreigner.", "I'm a foreigner."],
                  },
                  {
                    id: 2,
                    question: "You am not a foreigner.",
                    answer: [
                      "You are not a foreigner.",
                      "You aren't a foreigner.",
                    ],
                  },
                  {
                    id: 3,
                    question: "Does I speak English?",
                    answer: ["Do I speak English?"],
                  },
                  {
                    id: 4,
                    question: "Am you Turk?",
                    answer: ["Are you Turk?"],
                  },
                ],
              },
              {
                id: 10,
                type: "write",
                description:
                  "Aşağıdaki cümleleri ingilizceye çeviriniz. Yeni zamirleri kullanınız. (We, They, He/She)",
                questions: [
                  {
                    id: 1,
                    question: "Biz yabancıyız.",
                    a: "We are foreigner.",
                    b: "We are foreigners.",
                    c: "We are a foreigner.",
                    d: "We is foreigners.",
                    isCorrect: "b",
                  },
                  {
                    id: 2,
                    question: "Onlar Türk.",
                    a: "They are Turk.",
                    b: "They is Turk.",
                    c: "They are Turks.",
                    d: "They are Turkish.",
                    isCorrect: "a",
                  },
                  {
                    id: 3,
                    question: "O (erkek) İngilizce konuşuyor.",
                    a: "He speak English.",
                    b: "He speaks English.",
                    c: "He is speak English.",
                    d: "He speak English?",
                    isCorrect: "b",
                  },
                  {
                    id: 4,
                    question: "Biz İngilizce konuşuyor muyuz?",
                    a: "Do we speak English?",
                    b: "Are we speak English?",
                    c: "Does we speak English?",
                    d: "Do we speaks English?",
                    isCorrect: "a",
                  },
                  {
                    id: 5,
                    question: "Onlar Türkçe konuşmuyorlar.",
                    a: "They don't speak Turkish.",
                    b: "They doesn't speak Turkish.",
                    c: "They not speak Turkish.",
                    d: "They aren't speak Turkish.",
                    isCorrect: "a",
                  },
                  {
                    id: 5,
                    question: "O (kadın) bir yabancı mı?",
                    a: "Is she a foreigner?",
                    b: "Are she a foreigner?",
                    c: "Does she a foreigner?",
                    d: "She is a foreigner?",
                    isCorrect: "a",
                  },
                  {
                    id: 5,
                    question: "Biz Amerikalı değiliz.",
                    a: "We are American.",
                    b: "We are not American.",
                    c: "We don't American.",
                    d: "We isn't American.",
                    isCorrect: "b",
                  },
                  {
                    id: 5,
                    question: "Onlar yabancı değiller mi?",
                    a: "Isn't they foreigners?",
                    b: "Are they foreigners?",
                    c: "Don't they foreigners?",
                    d: "Aren't they foreigners?",
                    isCorrect: "d",
                  },
                  {
                    id: 5,
                    question: "O (erkek) İngilizce konuşmuyor mu?",
                    a: "Doesn't he speak English?",
                    b: "Don't he speak English?",
                    c: "Does he speak English?",
                    d: "Is he not speak English?",
                    isCorrect: "a",
                  },
                  {
                    id: 5,
                    question: "Onlar İngilizce konuşuyorlar.",
                    a: "They speak English.",
                    b: "They speaks English.",
                    c: "They are speak English.",
                    d: "They speak English.",
                    isCorrect: "d",
                  },
                ],
              },
            ],

            words: [
              {
                id: 1,
                word: "A",
                translate: "Bir",
              },
              {
                id: 2,
                word: "A little",
                translate: "Biraz",
              },
              {
                id: 3,
                word: "Am",
                translate: "Olmak (ben)",
              },
              {
                id: 4,
                word: "American",
                translate: "Amerikalı",
              },
              {
                id: 5,
                word: "Are",
                translate: "Olmak (sen / siz)",
              },
              {
                id: 6,
                word: "British",
                translate: "İngiliz (millet)",
              },
              {
                id: 7,
                word: "Do",
                translate: "Yapmak (yardımcı fiil, ben/sen/biz/onlar için)",
              },
              {
                id: 8,
                word: "Does",
                translate: "Yapmak (yardımcı fiil, o için)",
              },
              {
                id: 9,
                word: "English",
                translate: "İngilizce",
              },
              {
                id: 10,
                word: "Excuse me",
                translate: "Affedersiniz",
              },
              {
                id: 11,
                word: "Foreigner",
                translate: "Yabancı",
              },
              {
                id: 12,
                word: "French",
                translate: "Fransızca",
              },
              {
                id: 13,
                word: "German",
                translate: "Almanca",
              },
              {
                id: 14,
                word: "Goodbye",
                translate: "Hoşça kal",
              },
              {
                id: 15,
                word: "He",
                translate: "O (erkek)",
              },
              {
                id: 16,
                word: "Hello",
                translate: "Merhaba",
              },
              {
                id: 17,
                word: "I",
                translate: "Ben",
              },
              {
                id: 18,
                word: "Is",
                translate: "Olmak (o)",
              },
              {
                id: 19,
                word: "Italian",
                translate: "İtalyanca",
              },
              {
                id: 20,
                word: "Know",
                translate: "Bilmek",
              },
              {
                id: 21,
                word: "Miss",
                translate: "Hanımefendi",
              },
              {
                id: 22,
                word: "Much",
                translate: "Çok",
              },
              {
                id: 23,
                word: "No",
                translate: "Hayır",
              },
              {
                id: 24,
                word: "Not",
                translate: "Değil",
              },
              {
                id: 25,
                word: "Please",
                translate: "Lütfen",
              },
              {
                id: 26,
                word: "She",
                translate: "O (kadın)",
              },
              {
                id: 27,
                word: "Sir",
                translate: "Beyefendi",
              },
              {
                id: 28,
                word: "Sorry",
                translate: "Üzgünüm",
              },
              {
                id: 29,
                word: "Speak",
                translate: "Konuşmak",
              },
              {
                id: 30,
                word: "Teacher",
                translate: "Öğretmen",
              },
              {
                id: 31,
                word: "Thank you",
                translate: "Teşekkür ederim",
              },
              {
                id: 32,
                word: "They",
                translate: "Onlar",
              },
              {
                id: 33,
                word: "Turk",
                translate: "Türk",
              },
              {
                id: 34,
                word: "Turkish",
                translate: "Türkçe",
              },
              {
                id: 35,
                word: "We",
                translate: "Biz",
              },
              {
                id: 36,
                word: "Yes",
                translate: "Evet",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default LessonData;
