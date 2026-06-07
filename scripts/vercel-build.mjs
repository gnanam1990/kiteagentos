// Vercel Build Output API (v3) builder.
// Produces a finished .vercel/output so Vercel does not have to detect a
// framework or resolve this pnpm/TypeScript monorepo itself:
//   - static/        the built Vite SPA
//   - functions/     a fully self-contained esbuild bundle of the Hono API
//   - config.json    routing: /api/* -> function, everything else -> SPA
import { build } from "esbuild";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, ".vercel/output");
const WEB_FILTER = "@kiteagentos/web";

rmSync(out, { recursive: true, force: true });

// 1. Build the Vite SPA.
execSync(`pnpm --filter ${WEB_FILTER} build`, { cwd: root, stdio: "inherit" });

// 2. Static assets.
mkdirSync(`${out}/static`, { recursive: true });
cpSync(`${root}/packages/web/dist`, `${out}/static`, { recursive: true });

// 3. Serverless function — fully self-contained bundle (no runtime resolution).
const fnDir = `${out}/functions/api.func`;
mkdirSync(fnDir, { recursive: true });
await build({
  entryPoints: [`${root}/server/index.ts`],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: `${fnDir}/index.mjs`,
  logLevel: "info",
});
writeFileSync(
  `${fnDir}/.vc-config.json`,
  JSON.stringify({ runtime: "nodejs22.x", handler: "index.mjs", launcherType: "Nodejs", shouldAddHelpers: true }, null, 2),
);

// 4. Routing.
writeFileSync(
  `${out}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "/api/(.*)", dest: "/api" },
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2,
  ),
);

console.log("Build Output API ready at .vercel/output");
