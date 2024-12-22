import { Hono } from "hono";
import entry from "~/api/entry.api.ts";

const routes = new Hono();

routes.route("/api/entry", entry);

export default routes;
