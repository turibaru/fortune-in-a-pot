import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Fortune in a Pot — make.fun entrypoint (Node 22, TypeScript).
// Reads entry.txt next to this file, validates it (1-120 Unicode code
// points, not empty / not only whitespace), then copies it byte-for-byte
// to <MAKEFUN_OUTPUT_DIR>/entry.txt (default "/output").
// No network, no writes into the repo, no rendering.

const dir = dirname(fileURLToPath(import.meta.url));
const entryPath = join(dir, "entry.txt");

const bytes = readFileSync(entryPath);
const text = bytes.toString("utf8");
const length = [...text].length;

if (text.trim().length === 0) {
  console.error(
    `error: ${entryPath} is empty or only whitespace; entry must be 1-120 characters`,
  );
  process.exit(1);
}

if (length < 1 || length > 120) {
  console.error(`error: entry.txt must be 1-120 characters, got ${length}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), bytes);
