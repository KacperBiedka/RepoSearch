export const convertAtomDate = (date) => {
  let convertedDate = new Date(date);
  convertedDate.toISOString();
  let day = convertedDate.getUTCDate();
  let month = convertedDate.getUTCMonth() + 1;
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  const year = convertedDate.getUTCFullYear();
  return `${day}.${month}.${year}`;
};
