import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });

const src = new URL("./meme.png", import.meta.url);
const data = readFileSync(src);

// Gate check (sealed scorer): entry.png must be a whole PNG, at most
// 1 MiB (1,048,576 bytes) and at most 1024x1024 pixels. Fail loudly
// instead of writing an invalid entry.
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!data.subarray(0, 8).equals(PNG_SIG) || data.length < 33) {
  throw new Error("meme.png is not a whole PNG file");
}
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (data.length > 1048576) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB gate`);
}
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}
console.log(`gate ok: PNG ${width}x${height}, ${data.length} bytes`);
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, data);
console.log(`wrote ${outPath}: ${data.length} bytes`);
process.exit(0);
