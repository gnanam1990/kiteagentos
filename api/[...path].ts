import { Hono } from "hono";
import { handle } from "hono/vercel";
import { app } from "../packages/api/src/app.js";

// Vercel Serverless Function (Node.js runtime). Mounts the shared Hono app under
// /api so the production frontend can call the real backend at same-origin /api/*.
// The web app still falls back to bundled preview data if this function is down.
const root = new Hono();
root.route("/api", app);

export default handle(root);
