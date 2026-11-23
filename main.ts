// Entry program for the news-image-20261123 competition.
//
// The poster for Monday 23 November 2026 is stored next to this file as
// entry.png. This program checks that the file is a complete PNG with
// exactly the dimensions the contest requires, then copies its bytes
// unchanged into the grader's output directory. Because the bytes are
// copied verbatim, running the program twice produces identical output.
//
// Local run:  MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_SIZE = 1048576;
const WANT_WIDTH = 1024;
const WANT_HEIGHT = 1024;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const posterFile = join(scriptDir, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function reject(reason: string): never {
  throw new Error("poster validation failed: " + reason);
}

const bytes = readFileSync(posterFile);

if (bytes.length === 0) {
  reject("entry.png is empty");
}
if (bytes.length > MAX_SIZE) {
  reject("entry.png is " + bytes.length + " bytes, over the 1 MiB limit");
}

const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
for (let i = 0; i < signature.length; i++) {
  if (bytes[i] !== signature[i]) {
    reject("byte " + i + " does not match the PNG signature");
  }
}

const lastChunkType = bytes.toString("latin1", bytes.length - 8, bytes.length - 4);
if (lastChunkType !== "IEND") {
  reject("final chunk is " + lastChunkType + ", expected IEND");
}

const firstChunkType = bytes.toString("latin1", 12, 16);
if (firstChunkType !== "IHDR") {
  reject("first chunk is " + firstChunkType + ", expected IHDR");
}

const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== WANT_WIDTH || height !== WANT_HEIGHT) {
  reject("poster measures " + width + "x" + height + ", expected 1024x1024");
}

mkdirSync(outputDir, { recursive: true });
const destination = join(outputDir, "entry.png");
writeFileSync(destination, bytes);

// Read the result back and compare it against the source, so a short or
// corrupted write fails loudly instead of reaching the grader.
const writtenBack = readFileSync(destination);
if (!writtenBack.equals(bytes)) {
  reject("the written entry.png does not match the poster bytes");
}
