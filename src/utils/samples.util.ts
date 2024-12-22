import { getRandomItem } from "~/utils/array.util.ts";

const sampleFirstNames = Deno.readTextFileSync(
  `${Deno.cwd()}/src/data/firstnames.txt`
)
  .split(/\r?\n/)
  .filter((e) => e);

const sampleLastNames = Deno.readTextFileSync(
  `${Deno.cwd()}/src/data/lastnames.txt`
)
  .split(/\r?\n/)
  .filter((e) => e);

export const getRandomFirstName = () => {
  return getRandomItem(sampleFirstNames) as string;
};
export const getRandomLastName = () => {
  return getRandomItem(sampleLastNames) as string;
};
