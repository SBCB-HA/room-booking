import { Booking, Room, Status } from "../models.js";
import { Repository } from "../repository.js";

// One class, two labels
const roomRepo = new Repository<Room>([{ id: "Sky", pricePerHour: 200000 }]);
const bookingRepo = new Repository<Booking>();

bookingRepo.add({ id: "bk1", room: "Sky", customer: "Liam", date: "2026-11-12", start: 9, hours: 2, status: Status.Confirmed });

console.log(roomRepo.getAll().length, "room,", bookingRepo.getAll().length, "booking");
