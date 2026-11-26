import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });

const src = new URL("./meme.png", import.meta.url);
const data = readFileSync(src);
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, data);
console.log(`wrote ${outPath}: ${data.length} bytes`);
process.exit(0);
