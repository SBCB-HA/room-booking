import { readFile, writeFile } from "node:fs/promises";
import { Booking, Room, RoomName, Status } from "./models.js";

const ROOM_NAMES: RoomName[] = ["Sky", "Ocean", "Forest"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRoom(value: unknown): value is Room {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    ROOM_NAMES.includes(value.id as RoomName) &&
    typeof value.pricePerHour === "number" &&
    Number.isFinite(value.pricePerHour) &&
    value.pricePerHour >= 0
  );
}

function isBooking(value: unknown): value is Booking {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.room === "string" &&
    ROOM_NAMES.includes(value.room as RoomName) &&
    typeof value.customer === "string" &&
    typeof value.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    typeof value.start === "number" &&
    Number.isInteger(value.start) &&
    value.start >= 0 &&
    value.start <= 23 &&
    typeof value.hours === "number" &&
    Number.isInteger(value.hours) &&
    value.hours >= 1 &&
    value.start + value.hours <= 24 &&
    Object.values(Status).includes(value.status as Status)
  );
}

// JSON is untrusted input: parse it as unknown, then validate every item.
async function loadList<T>(
  file: string,
  isItem: (value: unknown) => value is T
): Promise<T[]> {
  try {
    const text = await readFile(file, "utf-8");
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed) || !parsed.every(isItem)) {
      throw new Error(`Invalid data in ${file}: expected a valid JSON list`);
    }
    return parsed;
  } catch (err) {
    if (isRecord(err) && err.code === "ENOENT") {
      console.log(`No ${file} yet, starting empty.`);
      return [];
    }
    throw err;
  }
}

export const loadRooms = () => loadList<Room>("rooms.json", isRoom);
export const loadBookings = () => loadList<Booking>("bookings.json", isBooking);

export async function saveBookings(bookings: Booking[]): Promise<void> {
  await writeFile("bookings.json", JSON.stringify(bookings, null, 2), "utf-8");
}
