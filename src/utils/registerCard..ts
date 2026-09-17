import { RegistrationCardType } from "@/types/addCardType";

export const parseRegistrationCardDetailed = (
  ocrResults: string[]
): RegistrationCardType => {
  return {
    plate: ocrResults[0],
    chassisNumber: ocrResults[1],
    brand: ocrResults[2],
    model: ocrResults[3],
    year: ocrResults[4],
    name: ocrResults[5],
    surname: ocrResults[6],
    tckn: ocrResults[6],
    email: ocrResults[7],
    phone: ocrResults[8],
    address: ocrResults[9],
    city: ocrResults[10],
    district: ocrResults[11],
    allData: ocrResults,
  };
};
