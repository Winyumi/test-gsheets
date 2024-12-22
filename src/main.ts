import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "~/config.ts";
import routes from "~/routes.ts";

const app = new Hono();

app.route("/", routes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    if (err.status >= 500) console.error(err);
    return c.json({ error: err.message, cause: err.cause }, err.status);
  }
  console.error(err);
  return c.json({ error: err.message }, 500);
});

Deno.serve({ port: env.PORT }, app.fetch);
