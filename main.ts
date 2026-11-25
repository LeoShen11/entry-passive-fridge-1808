// Notes From a Passive-Aggressive Fridge — make.fun entry.
// Writes one single-line passive-aggressive fridge note to entry.txt.
// The fridge is smug about its door sensor, petty about the owner's
// habit of opening it and taking nothing, and the yogurt is its witness.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const NOTE =
  "You opened me 14 times today and took nothing. The yogurt saw it all — and unlike you, it remembers.";

// --- Validation (the entry's own checks, before anything is written) ---
const chars = [...NOTE].length; // code points, matching the gate's character count
const words = NOTE.trim().split(/\s+/).length;
if (chars < 1 || chars > 200) {
  throw new Error(`note must be 1-200 characters, got ${chars}`);
}
if (words < 5) {
  throw new Error(`note must carry a real sentence, got ${words} words`);
}
if (NOTE.trim().length === 0) {
  throw new Error("note must not be only whitespace");
}
if (NOTE.includes("\n") || NOTE.includes("\r")) {
  throw new Error("note must be a single line");
}
if (NOTE !== NOTE.trim()) {
  throw new Error("note must not start or end with whitespace");
}

// --- Write it, exactly, with no trailing newline ---
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, NOTE, "utf8");

// --- Read-back check: what landed on disk must be byte-identical ---
const back = readFileSync(outPath, "utf8");
if (back !== NOTE) {
  throw new Error("read-back mismatch: entry.txt does not match the note");
}
if (back.endsWith("\n") || back.endsWith("\r")) {
  throw new Error("entry.txt must not end with a newline");
}
if ([...back].length !== chars) {
  throw new Error("read-back character count mismatch");
}
console.log(`wrote ${outPath} (${chars} characters, single line)`);
