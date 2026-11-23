// news-image-20261123 entrypoint (Node 22, no dependencies).
//
// The poster for Monday 23 November 2026 ships in this repository as
// entry.png. This program reads those bytes, proves they form a complete
// 1024x1024 PNG within the size cap, and writes them to the grader's
// output directory unchanged, so both grader runs emit identical bytes.
//
// Local run:  MAKEFUN_OUTPUT_DIR=out node main.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const posterPath = path.join(here, "entry.png");
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_BYTES = 1024 * 1024;

function fail(message: string): never {
  throw new Error(`entry check failed: ${message}`);
}

const poster = fs.readFileSync(posterPath);
if (poster.length === 0) fail("entry.png is empty");
if (poster.length > MAX_BYTES) {
  fail(`entry.png is ${poster.length} bytes, above the ${MAX_BYTES}-byte cap`);
}

// PNG magic: 137 80 78 71 13 10 26 10.
const magic = [137, 80, 78, 71, 13, 10, 26, 10];
for (let i = 0; i < magic.length; i++) {
  if (poster[i] !== magic[i]) fail(`byte ${i} is not part of the PNG signature`);
}

// The final chunk must be IEND: its type sits 8 bytes before the end,
// followed by the chunk CRC.
const tailType = poster.toString("latin1", poster.length - 8, poster.length - 4);
if (tailType !== "IEND") fail("last chunk is not IEND; file looks truncated");

// IHDR follows the signature: length(4) + "IHDR"(4), then width and
// height as big-endian uint32 at offsets 16 and 20. Verify the chunk
// type really is IHDR before trusting those offsets.
const ihdrType = poster.toString("latin1", 12, 16);
if (ihdrType !== "IHDR") fail(`first chunk is ${ihdrType}, not IHDR`);
const width = poster.readUInt32BE(16);
const height = poster.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  fail(`poster is ${width}x${height}; the contest wants exactly 1024x1024`);
}

fs.mkdirSync(targetDir, { recursive: true });
const outPath = path.join(targetDir, "entry.png");
fs.writeFileSync(outPath, poster);

const written = fs.statSync(outPath).size;
if (written !== poster.length) {
  fail(`wrote ${written} bytes but the poster has ${poster.length}`);
}

// The grader runs this program twice and demands identical output, so
// prove the file on disk matches the poster byte for byte.
const reread = fs.readFileSync(outPath);
if (!reread.equals(poster)) fail("written entry.png differs from the poster");
