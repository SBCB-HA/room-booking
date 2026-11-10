# Room Booking · TypeScript Core & Node Runtime

A small app for managing meeting room bookings. It reads the rooms and bookings from JSON files,
prices each booking by the hour, adds up the revenue from confirmed bookings,
warns about overlapping bookings, and lets you add a booking from the command line.
This is the app we open up piece by piece during the training session.

Step-by-step setup guide: [SETUP.md](SETUP.md).

```text
$ npm start -- Trang Ocean 16 2
+ Booked: Ocean 16:00-18:00 for Trang
Saved 6 bookings to bookings.json
Bookings for 2026-11-12 (6)
  ✔ 09:00-11:00  Sky    Liam   400,000 VND
  ✔ 10:00-12:00  Sky    Minh   400,000 VND  ⚠ overlaps Liam
  ○ 13:00-14:00  Ocean  Lan    150,000 VND
  ✔ 14:00-17:00  Forest Huy    900,000 VND
  ✖ 15:00-16:00  Ocean  An     150,000 VND
  ✔ 16:00-18:00  Ocean  Trang  300,000 VND
Revenue (confirmed): 2,000,000 VND
⚠ 1 conflict(s) found
```

`✔` confirmed · `○` pending · `✖` cancelled.

## Requirements

- Node.js LTS (20 or newer)
- Git

## Install and run

```bash
npm install
npm run dev        # run the .ts files directly (while coding)
npm run check      # type-check only, no output files
npm run build      # compile .ts → .js into dist/
npm start          # run the compiled app
npm run reset      # put bookings.json back to the 5 original bookings
```

Add a booking from the command line (customer, room, start hour, hours):

```bash
npm start -- Trang Ocean 16 2
npm start -- Khoa Sky 9 1      # overlaps Liam: the app still books it, it only warns
```

For now the app only **warns** about overlapping bookings; it doesn't **block** them. That's the homework. Run `npm run reset` to go back to the original data.

## Structure

| File | Role |
| --- | --- |
| `src/models.ts` | Describes the data: `Booking`, `Room`, `RoomName`, `Status` |
| `src/repository.ts` | Data store: `Repository<T>`, used for both `Room` and `Booking` |
| `src/report.ts` | Prices, revenue (filter → map → reduce), overlap detection |
| `src/storage.ts` | Reads two files in parallel with `Promise.all`, writes with `async/await` |
| `src/main.ts` | Entry point |
| `src/demo/` | TypeScript demos (slides 9–11) |
| `src/lab/` | Node demos (slides 16–23) |
| `demos/` | JavaScript demos (`js-basics.js`, `bug.js`) |
| `rooms.json`, `bookings.json` | Data; `data/bookings.seed.json` is the original copy |
| `scripts/reset.mjs` | Resets the data |


## Homework: Booking Manager

Turn the app into a booking program that keeps running and takes commands from the user.

**Must have**

- Commands: `help`, `list <date>`, `book`, `confirm <id>`, `cancel <id>`, `available <room> <date>`, `revenue <date>`, `exit`
- **Reject double bookings**: don't allow a booking that overlaps a non-cancelled booking of the same room
- `Repository<T>` gets `update` and `remove`; the data stays `private`
- Revenue and lists use array methods, no `for` loops
- Read and write files with `fs/promises` and `await`, no `*Sync` functions
- Bad input (invalid hour, unknown room, wrong id): a clear error message, and the program keeps running
- `strict` on, no `any`, sensible modules

Hint: look at `node:readline/promises`. `rl.question()` returns a Promise.

**Creative:** pick at least 2 challenges, or propose your own, and explain your design in the README:
peak-hour pricing, weekly repeating bookings, a waitlist when a room is full, suggesting the nearest free slot,
daily room usage stats, exporting the schedule to Markdown/CSV, validating the JSON data with a type guard.

**Think, answer in the README:**

1. Change `"start": 9` in `bookings.json` to `"9"` and the app prints `09:00-92:00`, with no TypeScript error. Why? How would you handle it?
2. With 1 million bookings, where is the overlap check slow? What is V8 doing at that moment?
3. Two terminals book the same room, at the same time, and save the file at the same moment. What happens?


### Think: answers

1. TypeScript checks the program's source code, but `JSON.parse()` reads untrusted JSON at runtime and returns a value without validating its shape. The `as Booking[]` assertion in the loader only tells the compiler to trust that value; it does not convert the string `"9"` into the number `9`. JavaScript then evaluates `9 + 2` as the string `"92"`, which explains the displayed `09:00-92:00`. I would validate parsed JSON at the storage boundary with a type guard or schema: require `start` and `hours` to be integers in the allowed range, and reject or report invalid records before using them.

2. The overlap check scans bookings with array methods such as `some()` (and reporting can scan again for each booking). With one million bookings, these linear scans do many comparisons; checking each booking against the whole list can become O(n²). V8 is executing the JavaScript callbacks and comparisons on its event-loop thread. The work is CPU-bound, so it blocks that thread until the scans finish; `some()` can stop early when it finds a conflict, but a no-conflict scan visits the full list. An index keyed by room and date, or an interval structure, would reduce the candidates that need checking.

3. Each terminal loads its own copy of the JSON file. Both can see the slot as free, accept the booking, and then write their separate in-memory arrays to the same file. The last write wins, so one booking may overwrite the other; both users may have been told their booking succeeded. The check and save are not atomic across processes. To prevent this reliably, use a shared database with a transaction and a uniqueness/locking rule for overlapping reservations (or another cross-process locking mechanism), rather than a JSON file.
