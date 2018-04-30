export const removeElementFromArray = (arr, value) => arr.filter(item => item !== value);

export const arrayDifference = (arr, toRemove) => arr.filter(el => !toRemove.includes(el));
