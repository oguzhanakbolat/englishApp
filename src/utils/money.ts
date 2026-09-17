export const moneyFormatter = (money: number) => {
  return money.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
};