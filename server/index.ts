import { Hono } from "hono";
import { handle } from "@hono/node-server/vercel";
import { app } from "../packages/api/src/app.js";

// Vercel Serverless Function (Node.js runtime). Mounts the shared Hono app under
// /api so the production frontend can call the real backend at same-origin /api/*.
// The web app still falls back to bundled preview data if this function is down.
// Note: uses the @hono/node-server Vercel adapter (Node runtime), not hono/vercel
// (which targets the Edge runtime and fails under the default Node runtime).
const root = new Hono();
root.route("/api", app);
root.notFound((c) => c.json({ error: "Not found" }, 404));
root.onError((error, c) => c.json({ error: error instanceof Error ? error.message : "Internal error" }, 500));

export default handle(root);
