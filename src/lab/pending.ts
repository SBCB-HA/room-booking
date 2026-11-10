import { loadBookings } from "../storage.js";

console.log("Without await:", loadBookings()); // Promise { <pending> }

const bookings = await loadBookings();
console.log("With await:", bookings.length, "bookings");
