export interface BookingSlot {
  time_start: string;
  time_end: string;
  available: boolean;
}

export interface GetSlotRequest {
  specialistId: string;
  date: string;
}

export interface CreateBookingRequest {
  specialistId: string;
  date: string;
  timeStart: string;
  patientId: string;
}
