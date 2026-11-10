// Put bookings.json back to the 5 original bookings (before a demo, or after trying things out).
import { copyFile } from "node:fs/promises";

await copyFile("data/bookings.seed.json", "bookings.json");
console.log("bookings.json has been reset to the original data.");
