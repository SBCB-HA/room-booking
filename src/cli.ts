import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Booking, Room, RoomName, Status } from "./models.js";
import { Repository } from "./repository.js";
import { cost, hasConflict, printReport, time, vnd } from "./report.js";
import { loadBookings, loadRooms, saveBookings } from "./storage.js";

const ROOM_NAMES: RoomName[] = ["Sky", "Ocean", "Forest"];

function isRoomName(value: string | undefined): value is RoomName {
  return ROOM_NAMES.includes(value as RoomName);
}

function requireDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Date must use YYYY-MM-DD format");
  }
  return value;
}

const rl = readline.createInterface({ input, output });
let running = true;

const [rooms, bookings] = await Promise.all([loadRooms(), loadBookings()]);
const roomRepo = new Repository<Room>(rooms);
const bookingRepo = new Repository<Booking>(bookings);

function list(args: string[]): void {
  const date = args[0];
  if (!date) throw new Error("Usage: list <date>");
  requireDate(date);
  const today = bookingRepo.getAll().filter((b) => b.date === date);
  console.log(`Booking for ${date} (${today.length})`);
  printReport(today, roomRepo.getAll());
}

function revenue(args: string[]): void {
  const date = args[0];
  if (!date) throw new Error("Usage: revenue <date>");
  requireDate(date);
  const rooms = roomRepo.getAll();
  const confirmed = bookingRepo
    .getAll()
    .filter((b) => b.date === date && b.status === Status.Confirmed);
  const amounts = confirmed.map((b) => cost(b, rooms));
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  console.log(`Revenue on ${date}: ${vnd(total)}`);
}

async function cancel(args: string[]): Promise<void> {
  const id = args[0];
  if (!id) throw new Error("Usage: cancel <id>");
  const booking = bookingRepo.findById(id);
  if (!booking) throw new Error(`No booking with id "${id}"`);
  if (booking.status === Status.Cancelled) throw new Error(`${id} is already cancelled`);
  bookingRepo.update(id, { status: Status.Cancelled });
  await saveBookings(bookingRepo.getAll());
  console.log(`✖ Cancelled ${id}`);
}

async function confirm(args: string[]): Promise<void> {
  const id = args[0];
  if (!id) throw new Error("Usage: confirm <id>");
  const booking = bookingRepo.findById(id);
  if (!booking) throw new Error(`No booking with id "${id}"`);
  if (booking.status !== Status.Pending) throw new Error(`${id} is not pending`);
  bookingRepo.update(id, { status: Status.Confirmed });
  await saveBookings(bookingRepo.getAll());
  console.log(`✔ Confirmed ${id}`);
}

async function book(args: string[]): Promise<void> {
  if (args.length !== 5) throw new Error("Usage: book <customer> <room> <date> <start> <hours>");
  const [customer, room, rawDate, startText, hoursText] = args;

  if (!customer || !rawDate || !startText || !hoursText) {
    throw new Error("Usage: book <customer> <room> <date> <start> <hours>");
  }
  if (!isRoomName(room)) throw new Error("Invalid room name");
  const date = requireDate(rawDate);

  const start = Number(startText);
  const hours = Number(hoursText);
  if (!Number.isInteger(start) || !Number.isInteger(hours)) {
    throw new Error("Start and hours must be integers");
  }
  if (start < 0 || start > 23 || hours < 1 || start + hours > 24) {
    throw new Error("Invalid time range");
  }

  const newBooking: Booking = {
    id: `bk_${Date.now()}`,
    customer,
    room,
    date,
    start,
    hours,
    status: Status.Pending,
  };

  if (hasConflict(newBooking, bookingRepo.getAll())) {
    throw new Error("Room is already booked");
  }

  bookingRepo.add(newBooking);
  await saveBookings(bookingRepo.getAll());
  console.log(`✔ Booked ${newBooking.id}`);
}

function available(args: string[]): void {
  const [room, rawDate] = args;
  if (!room || !rawDate) throw new Error("Usage: available <room> <date>");
  if (!isRoomName(room)) throw new Error("Invalid room name");
  const date = requireDate(rawDate);
  const busy = bookingRepo
    .getAll()
    .filter((b) => b.room === room && b.date === date && b.status !== Status.Cancelled);
  const freeHours = Array.from({ length: 24 }, (_, hour) => hour).filter(
    (hour) => !busy.some((b) => hour >= b.start && hour < b.start + b.hours)
  );
  console.log(freeHours.map(time).join(", ") || "No free hours");
}

// Creative feature: suggest the available start closest to the requested hour.
function suggest(args: string[]): void {
  if (args.length !== 4) throw new Error("Usage: suggest <room> <date> <start> <hours>");
  const [room, rawDate, startText, hoursText] = args;
  if (!room || !rawDate || !startText || !hoursText) {
    throw new Error("Usage: suggest <room> <date> <start> <hours>");
  }
  if (!isRoomName(room)) throw new Error("Invalid room name");
  const date = requireDate(rawDate);
  const requestedStart = Number(startText);
  const hours = Number(hoursText);
  if (!Number.isInteger(requestedStart) || !Number.isInteger(hours)) {
    throw new Error("Start and hours must be integers");
  }
  if (requestedStart < 0 || requestedStart > 23 || hours < 1 || hours > 24) {
    throw new Error("Invalid time range");
  }

  const bookings = bookingRepo.getAll();
  const candidateStarts = Array.from({ length: 25 - hours }, (_, start) => start)
    .sort((a, b) => Math.abs(a - requestedStart) - Math.abs(b - requestedStart) || a - b);
  const suggestedStart = candidateStarts.find((start) => {
    const candidate: Booking = {
      id: "suggestion",
      room,
      customer: "Suggestion",
      date,
      start,
      hours,
      status: Status.Pending,
    };
    return !hasConflict(candidate, bookings);
  });

  if (suggestedStart === undefined) {
    console.log("No free slot for that duration");
    return;
  }
  console.log(`Nearest free slot: ${time(suggestedStart)}-${time(suggestedStart + hours)}`);
}

async function execute(command: string, args: string[]): Promise<void> {
  if (command === "help") {
    console.log("Commands: help, list <date>, book <customer> <room> <date> <start> <hours>, confirm <id>, cancel <id>, available <room> <date>, suggest <room> <date> <start> <hours>, revenue <date>, exit");
  } else if (command === "list") list(args);
  else if (command === "revenue") revenue(args);
  else if (command === "cancel") await cancel(args);
  else if (command === "confirm") await confirm(args);
  else if (command === "book") await book(args);
  else if (command === "available") available(args);
  else if (command === "suggest") suggest(args);
  else throw new Error(`Unknown command "${command}"`);
}

while (running) {
  const line = await rl.question("> ");
  const [command = "", ...args] = line.trim().split(/\s+/);
  try {
    if (command === "exit") running = false;
    else if (command !== "") await execute(command, args);
  } catch (err) {
    console.log("Error:", (err as Error).message);
  }
}
rl.close();
