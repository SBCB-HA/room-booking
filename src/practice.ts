import { Booking, Status } from "./models.js";
import { Repository } from "./repository.js";
import { hasConflict} from "./report.js"
const repo = new Repository<Booking>([
  { id: "bk1", room: "Sky", customer: "Liam", date: "2026-11-12", start: 9, hours: 2, status: Status.Pending },
  { id: "bk2", room: "Ocean", customer: "Lan", date: "2026-11-12", start: 13, hours: 1, status: Status.Pending },
]);

console.log("1. update:", repo.update("bk1", { status: Status.Confirmed }));
console.log("2. bk1 status:", repo.findById("bk1")?.status);
console.log("3. bk2 status:", repo.findById("bk2")?.status);
try {
  repo.update("bk999", { status: Status.Cancelled });
} catch (err) {
  console.log("4. error:", (err as Error).message);
}
console.log("5. remove bk2:", repo.remove("bk2"));
console.log("6. remove bk2 again:", repo.remove("bk2"));
console.log("7. left:", repo.getAll().map((b) => b.id));
const existing: Booking[] = [
  { id: "bk1", room: "Sky", customer: "Liam", date: "2026-11-12", start: 9, hours: 2, status: Status.Confirmed },
  { id: "bk2", room: "Sky", customer: "Minh", date: "2026-11-12", start: 14, hours: 1, status: Status.Cancelled },
];

const make = (room: Booking["room"], start: number, hours: number): Booking => ({
  id: "new", room, customer: "Test", date: "2026-11-12", start, hours, status: Status.Pending,
});

console.log("a. Sky 10-12:", hasConflict(make("Sky", 10, 2), existing));   
console.log("b. Sky 11-12:", hasConflict(make("Sky", 11, 1), existing));   
console.log("c. Ocean 9-11:", hasConflict(make("Ocean", 9, 2), existing));
console.log("d. Sky 14-15:", hasConflict(make("Sky", 14, 1), existing));   