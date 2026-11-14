# Room Booking CLI

A TypeScript command-line app for booking meeting rooms. It stores rooms and bookings in JSON files, rejects new overlapping bookings, supports confirmations and cancellations, and reports availability and revenue.

## Start from a fresh checkout

Requirements: Node.js 20 or newer, Git.

```bash
git clone https://github.com/SBCB-HA/room-booking.git
cd room-booking
git checkout homework/hoanganh
npm install
npm run check
npm run dev
```

`npm run dev` launches the interactive TypeScript CLI. To compile and run the JavaScript build instead:

```bash
npm run build
npm start
```

Reset the booking data to the original sample before repeating the examples:

```bash
npm run reset
```

## Commands

Type `help` in the running app for the command list.

| Command | What it does |
| --- | --- |
| `list <date>` | Shows bookings and confirmed revenue for a date |
| `book <customer> <room> <date> <start> <hours>` | Adds a pending booking if the room is free |
| `confirm <id>` | Confirms a pending booking |
| `cancel <id>` | Cancels a booking and frees its time |
| `available <room> <date>` | Lists free hours |
| `suggest <room> <date> <start> <hours>` | Finds the free start time nearest to the requested hour |
| `revenue <date>` | Shows confirmed revenue for a date |
| `exit` | Quits the app |

Dates use `YYYY-MM-DD`; start and duration are whole hours. A booking that overlaps any pending or confirmed booking in the same room and date is rejected. Cancelled bookings do not block the time. Invalid input prints a clear error and returns to the prompt.

## Try it

The original sample data intentionally contains a pre-existing Sky overlap between Liam (09:00–11:00) and Minh (10:00–12:00). The CLI reports that legacy conflict in `list`; it rejects any new booking that overlaps either one.

Example session with the original sample data:

```text
> revenue 2026-11-12
Revenue on 2026-11-12: 2,000,000 VND
> available Sky 2026-11-12
00:00, 01:00, 02:00, 03:00, 04:00, 05:00, 06:00, 07:00, 08:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00, 22:00, 23:00
> book Test Sky 2026-11-12 10 1
Error: Room is already booked
> suggest Sky 2026-11-12 10 1
Nearest free slot: 12:00-13:00
> book Test Sky 2026-11-12 12 1
✔ Booked bk_<timestamp>
> book Test Unknown 2026-11-12 20 1
Error: Invalid room name
> book Test Sky 2026-11-12 23 2
Error: Invalid time range
> confirm bk999
Error: No booking with id "bk999"
```

The booking ID contains the current timestamp, so its exact value changes. After creating it, use the printed ID with `confirm <id>` or `cancel <id>`. The prompt remains available after each input error. Use `cancel bk2` to cancel Minh's legacy booking and remove the original overlap warning. Run `npm run reset` to restore the sample data.

## Code map

| File | Responsibility |
| --- | --- |
| `src/models.ts` | Booking, room, and status types |
| `src/repository.ts` | Generic in-memory repository with private data, add, update, remove, and lookup |
| `src/storage.ts` | Async JSON file access and runtime type guards for loaded room/booking data |
| `src/report.ts` | Formatting, pricing, overlap detection, and report output |
| `src/cli.ts` | Interactive commands, input validation, booking rules, and nearest-slot suggestion |
| `rooms.json`, `bookings.json` | Persistent data files |

The list and revenue reports use `filter`, `map`, and `reduce`. File operations use `node:fs/promises` and `await`. TypeScript strict mode is enabled.

## Creative challenges implemented

1. **Suggest the nearest free slot.** The `suggest` command checks valid start hours ordered by distance from the requested start and returns the closest slot that does not overlap an active booking.
2. **Validate JSON with type guards.** Files are parsed as `unknown`; each room and booking is checked before the value is treated as a TypeScript type. Invalid records, including a string value such as `"start": "9"`, produce a clear data error instead of being used in time calculations.

## Think: design notes

1. **Why did `"start": "9"` display `09:00-92:00` without a TypeScript error?** `JSON.parse` returns runtime data and does not validate its shape. A type assertion such as `as Booking[]` only silences the compiler; it does not convert the string to a number. JavaScript then evaluates `"9" + 2` as `"92"`. The storage type guards now reject that record when loading the file.
2. **What gets slow with one million bookings?** A direct overlap check scans the booking array in O(n). The report also searches earlier bookings for each displayed booking, so generating a full report can take O(n²) comparisons. V8 executes those synchronous callbacks and comparisons on the event-loop thread; the CPU work blocks other CLI input until it finishes. An index by room and date would reduce the number of candidates.
3. **What if two terminals book and save at once?** Each process has its own in-memory copy. Both can see a free slot and accept it, then each writes a full JSON snapshot. The last write can overwrite the other booking, even though both terminals reported success. A JSON file has no cross-process transaction; a shared database transaction or lock is needed to prevent this race.

## Submission

Commit and push the homework branch, then open a Pull Request titled `[Homework] <Full name>`. In its description, list the two creative challenges above.

```bash
git add .
git commit -m "Document booking CLI homework"
git push
```
