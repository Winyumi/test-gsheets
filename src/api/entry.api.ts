import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { dev } from "~/config.ts";
import { addEntries, getSheet } from "~/services/gsheets.service.ts";
import { getRandomFirstName, getRandomLastName } from "~/utils/samples.util.ts";
import { randomString } from "~/utils/string.util.ts";

const entry = new Hono();

entry.post("/", async (c) => {
  const entries = await c.req
    .json()
    .then((json) => (Array.isArray(json) ? json : [json]))
    .catch((err) => {
      throw new HTTPException(400, {
        message: "Invalid body input",
        cause: err.message,
      });
    });

  const spreadsheetId = c.req.header("spreadsheetId") ?? "";
  const spreadsheetKey = c.req.header("spreadsheetKey") ?? "";
  const sheetName = c.req.header("sheetName") ?? "";

  const sheet = await getSheet(spreadsheetId, spreadsheetKey, sheetName);
  await addEntries(sheet, entries);

  return c.body(null, 204);
});

entry.post("/test", async (c) => {
  if (!dev) return;

  const entries = [];
  const count = parseInt(c.req.query("count") || "1");
  const maxCount = 100;

  for (let i = 0; i < (count > maxCount ? maxCount : count); i++) {
    entries.push({
      timestamp: new Date().toISOString(),
      uid: randomString(8) + "-test",
      first_name: getRandomFirstName(),
      last_name: getRandomLastName(),
      item_1: "Test",
    });
  }

  const spreadsheetId = c.req.header("spreadsheetId") ?? "";
  const spreadsheetKey = c.req.header("spreadsheetKey") ?? "";
  const sheetName = c.req.header("sheetName") ?? "";

  const sheet = await getSheet(spreadsheetId, spreadsheetKey, sheetName);
  await addEntries(sheet, entries);

  return c.body(null, 204);
});

export default entry;
