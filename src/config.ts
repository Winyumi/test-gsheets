import { cleanEnv, json, num } from "envalid";

// Read credentials.json if GCP_CREDENTIALS env is not set
if (!Deno.env.get("GCP_CREDENTIALS")) {
  try {
    const json = Deno.readTextFileSync(`${Deno.cwd()}/credentials.json`);
    Deno.env.set("GCP_CREDENTIALS", json);
  } catch (err) {
    console.error(err);
  }
}

export const dev = /^(true|1)$/i.test(Deno.env.get("DEV") ?? "");

export const env = cleanEnv(Deno.env.toObject(), {
  PORT: num({ default: 3000 }),
  GCP_CREDENTIALS: json<GoogleCredentials>(),
});
