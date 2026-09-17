const dateFormatter = (date: string) => {
  return date.split("-").reverse().join("-");
};

const dateFormatterWithTime = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " " + newDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default  dateFormatter;

export { dateFormatter, dateFormatterWithTime };
