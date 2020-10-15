/**
 * Accepts the date in atom format and returns display string (DD-MM-YYYY)
 * @param {Atom format Date} date
 */
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

/**
 * Accepts an array of objects and filters the array based on filter and order
 * Supports nested object values of type: String, Number and Date
 * @param {Aray of Objects} array
 * @param {String} field
 * @param {String} order
 */
export const sortByField = (array, field, order) => {
  let multiplier;
  if (order === "desc") {
    multiplier = 1;
  } else {
    multiplier = -1;
  }
  const compareValues = (a, b) => {
    let val1 = a[field];
    let val2 = b[field];
    if (typeof val1 === "string" && typeof val2 === "string") {
      val1 = val1.toLowerCase();
      val2 = val2.toLowerCase();
    } else if (val1 instanceof Date && val2 instanceof Date) {
      val1 = val1.getTime();
      val2 = val2.getTime();
    }
    if (val1 < val2) {
      return -1 * multiplier;
    } else if (val1 > val2) {
      return 1 * multiplier;
    }
    return 0;
  };
  return array.sort(compareValues);
};
