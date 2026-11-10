import { readFile, writeFile } from "node:fs/promises";
import { Booking, Room } from "./models.js";

// One generic loader for any list stored as JSON.
async function loadList<T>(file: string): Promise<T[]> {
  try {
    const text = await readFile(file, "utf-8");
    return JSON.parse(text) as T[];
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      console.log(`No ${file} yet, starting empty.`);
      return []; // no file yet: not a real error
    }
    throw err; // anything else: let main() report it
  }
}

export const loadRooms = () => loadList<Room>("rooms.json");
export const loadBookings = () => loadList<Booking>("bookings.json");

export async function saveBookings(bookings: Booking[]): Promise<void> {
  await writeFile("bookings.json", JSON.stringify(bookings, null, 2), "utf-8");
}
