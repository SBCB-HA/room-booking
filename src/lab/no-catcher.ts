import { readFile } from "node:fs/promises";

console.log("Reading missing.json...");
const text = await readFile("missing.json", "utf-8");
console.log(text); // never reached
