export const randomString = (length: number = 1) => {
  let output = "";
  while (output.length < length) {
    output += Math.random().toString(36).substring(2);
  }
  return output.substring(0, length);
};
