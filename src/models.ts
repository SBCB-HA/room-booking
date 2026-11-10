export enum Status {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Cancelled = "CANCELLED",
}

export type RoomName = "Sky" | "Ocean" | "Forest";

export interface Booking {
  readonly id: string;
  room: RoomName;
  customer: string;
  date: string; // "YYYY-MM-DD"
  start: number; // hour of the day, 0-23
  hours: number;
  status: Status;
}

export interface Room {
  readonly id: RoomName;
  pricePerHour: number; // VND
}
