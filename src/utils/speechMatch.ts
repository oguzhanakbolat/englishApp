const CONTRACTIONS: [RegExp, string][] = [
  [/\bdon't\b/g, "do not"],
  [/\bdoesn't\b/g, "does not"],
  [/\bdidn't\b/g, "did not"],
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "cannot"],
  [/\bcannot\b/g, "cannot"],
  [/\baren't\b/g, "are not"],
  [/\bisn't\b/g, "is not"],
  [/\bwasn't\b/g, "was not"],
  [/\bweren't\b/g, "were not"],
  [/\bhaven't\b/g, "have not"],
  [/\bhasn't\b/g, "has not"],
  [/\bhadn't\b/g, "had not"],
  [/\bi'm\b/g, "i am"],
  [/\byou're\b/g, "you are"],
  [/\bwe're\b/g, "we are"],
  [/\bthey're\b/g, "they are"],
  [/\bit's\b/g, "it is"],
  [/\blet's\b/g, "let us"],
];

export const normalizeSpeech = (value: string) => {
  let text = value
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-");

  CONTRACTIONS.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  return text.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
};

const levenshtein = (a: string, b: string) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = current;
    }
  }

  return row[b.length];
};

export const speechSimilarity = (expected: string, spoken: string) => {
  const left = normalizeSpeech(expected);
  const right = normalizeSpeech(spoken);

  if (!left && !right) return 100;
  if (!left || !right) return 0;

  const charScore =
    1 - levenshtein(left, right) / Math.max(left.length, right.length);

  const leftWords = left.split(" ").filter(Boolean);
  const rightWords = right.split(" ").filter(Boolean);
  const rightSet = new Set(rightWords);
  const overlap = leftWords.filter((word) => rightSet.has(word)).length;
  const wordScore = overlap / Math.max(leftWords.length, rightWords.length);

  return Math.round(Math.max(charScore, wordScore) * 100);
};
