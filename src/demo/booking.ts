//   1. room: "Sky"   -> room: "Moon"      (not a RoomName: union)
//   2. start: 9      -> start: "09:00"    (not a number)
//   3. delete the line "hours: 2,"        (a required field is missing)
//   4. status: Status.Confirmed -> status: "CONFIRMD"   (not a Status: enum)
import { Booking, Status } from "../models.js";

const booking: Booking = {
  id: "bk1",
  room: "Sky",
  customer: "Liam",
  date: "2026-11-12",
  start: 9,
  hours: 2,
  status: Status.Confirmed,
};

const bookings: Booking[] = [booking];
const found = bookings.find((b) => b.id === "bk9");
// console.log(found.customer);
if (found) {
  console.log(found.customer);
} else {
  console.log("No booking with id bk9");
}
