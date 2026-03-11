export interface Coords {
  lat: number;
  lng: number;
}

export interface SpecialistInfo {
  id: string;
  first_name: string;
  last_name: string;
  clinic_city: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_name: string;
  clinic_coords: Coords;
  clinic_schedule: SpecialistScheduleInfo[];
}

export interface SpecialistListRequest {
  lat: number;
  lng: number;
  radius: number;
}

export interface ListSpecialistSuccess {
  specialists: SpecialistInfo[];
}

export interface SpecialistScheduleInfo {
  day_of_week: number; // 0-6 (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  opening_morning: string;
  closing_morning: string;
  opening_afternoon: string;
  closing_afternoon: string;
  slot_size_minutes: number;
}
