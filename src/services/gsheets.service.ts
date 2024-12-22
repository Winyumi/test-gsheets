import { JWT } from "google-auth-library";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { HTTPException } from "hono/http-exception";
import { env } from "~/config.ts";
import {
  appendNewItems,
  findDuplicatesAndAppendDigit,
  replaceEmptyItems,
} from "~/utils/array.util.ts";

const serviceAccountAuth = new JWT({
  email: env.GCP_CREDENTIALS.client_email,
  key: env.GCP_CREDENTIALS.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const getSheet = async (
  spreadsheetId: string,
  spreadsheetKey: string,
  sheetName: string
) => {
  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  await doc.loadInfo().catch((err) => {
    throw new HTTPException(err.status || 500, {
      message: "Failed to load spreadsheet",
      cause: err.message,
    });
  });

  // Verify key
  const keysSheet = doc.sheetsByTitle["Key"];
  if (!keysSheet) {
    throw new HTTPException(409, { message: "Key sheet not found" });
  }
  const keysRows = (await keysSheet.getCellsInRange("A:A")) as string[][];
  const keys = keysRows.map((e) => e[0]);
  if (!keys.includes(spreadsheetKey)) {
    throw new HTTPException(401, { message: "Key is invalid" });
  }

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    throw new HTTPException(404, { message: "Sheet not found" });
  }

  return sheet;
};

export const addEntries = async (
  sheet: GoogleSpreadsheetWorksheet,
  entries: Record<string, string>[]
) => {
  if (!Array.isArray(entries)) entries = [entries];

  // Adjust headers if needed
  try {
    const oldHeaders = (await sheet.getCellsInRange("1:1"))?.[0] as string[];
    const newHeaders = (() => {
      let headers = oldHeaders;
      headers = replaceEmptyItems(headers, ".");
      headers = findDuplicatesAndAppendDigit(headers);
      for (const entry of entries) {
        headers = appendNewItems(headers, Object.keys(entry));
      }
      return headers;
    })();
    if (oldHeaders.join(",") !== newHeaders.join(",")) {
      // Resize sheet if too small
      if (sheet.columnCount < newHeaders.length) {
        await sheet.resize({
          columnCount: newHeaders.length,
          rowCount: sheet.rowCount,
        });
      }
      await sheet.setHeaderRow(newHeaders);
    }
  } catch (error) {
    throw new HTTPException(500, {
      message: "Failed to adjust headers",
      cause: error,
    });
  }

  // Add rows
  try {
    await sheet.addRows(entries);
  } catch (error) {
    throw new HTTPException(500, {
      message: "Failed to add entries",
      cause: error,
    });
  }
};
