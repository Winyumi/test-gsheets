// deno-lint-ignore-file no-explicit-any

export const findDuplicatesAndAppendDigit = (arr: any[]) => {
  const oldArray = arr.map((e) => String(e));
  const newArray: string[] = [];
  for (const oldItem of oldArray) {
    let newItem = oldItem;
    let k = 1;
    while (newArray.includes(newItem)) {
      newItem = oldItem + "(" + k + ")";
      k++;
    }
    newArray.push(newItem);
  }
  return newArray;
};

export const replaceEmptyItems = (arr: any[], replaceWith: any) => {
  return arr.map((e) => (!e ? replaceWith : e));
};

export const appendNewItems = (arr: any[], newItems: any[]) => {
  newItems = [...new Set(newItems)];
  newItems.forEach((e) => {
    if (arr.includes(e)) return;
    arr.push(e);
  });
  return arr;
};

export const getRandomItem = (arr: any[]) => {
  return arr[Math.ceil(Math.random() * arr.length) - 1];
};
