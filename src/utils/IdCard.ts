import { IdCardType } from "@/types/addCardType";

export const parseIdCardDetailed = (ocrResults: string[]): IdCardType => {
  const result: IdCardType = {
    tckn: null,
    name: null,
    surname: null,
    birthdate: null,
    allData: [],
  };

  for (const line of ocrResults) {
    if (!result.tckn) {
      const tcknMatch = line.match(/\b(\d{11})\b/);
      if (tcknMatch) {
        result.tckn = tcknMatch[1];
      } else {
        const tcknMatch = line.match(/\b(\d{12})\b/);
        if (tcknMatch) {
          result.tckn = tcknMatch[1].slice(1, 12);
        }
      }
    }

    if (!result.surname && /Soy|Sur|soy|sur/i.test(line)) {
      result.surname = line.split("\n")[1] || line;
    }

    if (!result.name && /Giv|giv/i.test(line)) {
      result.name = line.split("\n")[1] || line;
    }

    if (!result.birthdate && /Do|Dat|dat|bir/i.test(line)) {
      const birthdateMatch = line.match(/(\d{2}\.\d{2}\.\d{4})/);
      if (birthdateMatch) {
        result.birthdate = birthdateMatch[1];
      }
    }
  }

  return result;
};
