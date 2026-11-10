import { readFile } from "node:fs";

console.log("A: ask to read a file");
readFile("package.json", "utf-8", () => console.log("C: file is ready"));
console.log("B: do other work");
