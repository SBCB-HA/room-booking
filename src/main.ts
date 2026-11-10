import { Booking, Room, RoomName, Status } from "./models.js";
import { Repository } from "./repository.js";
import { printReport, time } from "./report.js";
import { loadBookings, loadRooms, saveBookings } from "./storage.js";

const DAY = "2026-11-12";
const ROOM_NAMES: RoomName[] = ["Sky", "Ocean", "Forest"];

// A type guard: checks at run time that a string really is a RoomName.
function isRoomName(value: string | undefined): value is RoomName {
  return ROOM_NAMES.includes(value as RoomName);
}

async function main(): Promise<void> {
  // Two files, loaded at the same time (principle 4)
  const [rooms, bookings] = await Promise.all([loadRooms(), loadBookings()]);
  const roomRepo = new Repository<Room>(rooms);
  const bookingRepo = new Repository<Booking>(bookings);

  // Optional booking from the command line: npm start -- <customer> <room> <start> <hours>
  const [customer, room, start, hours] = process.argv.slice(2);
  if (customer) {
    if (!isRoomName(room)) throw new Error(`Unknown room: ${room}`);
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      room,
      customer,
      date: DAY,
      start: Number(start),
      hours: Number(hours),
      status: Status.Confirmed,
    };
    if (!Number.isInteger(booking.start) || !Number.isInteger(booking.hours)) {
      throw new Error("start and hours must be whole numbers");
    }
    bookingRepo.add(booking);
    await saveBookings(bookingRepo.getAll());
    console.log(`+ Booked: ${room} ${time(booking.start)}-${time(booking.start + booking.hours)} for ${customer}`);
    console.log(`Saved ${bookingRepo.getAll().length} bookings to bookings.json`);
  }

  const today = bookingRepo.getAll().filter((b) => b.date === DAY);
  console.log(`Bookings for ${DAY} (${today.length})`);
  printReport(today, roomRepo.getAll());
}

main().catch((err) => {
  console.error("Something went wrong:", (err as Error).message);
  process.exitCode = 1;
});
