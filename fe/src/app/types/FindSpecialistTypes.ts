export type FindSpecialistItem = {
    id: string
    first_name: string
    last_name: string
    clinic_city: string
    clinic_address: string
    clinic_phone: string
    clinic_name: string
    clinic_coords: {
        x: number
        y: number
    }
    visible: boolean
    clinic_schedule: ClinicSchedule[]
}

export type ClinicSchedule = {
    id: string,
    id_day: number,
    id_specialist: string,
    deleted: boolean,
    opening_morning: string,
    closing_morning: string,
    opening_afternoon: string,
    closing_afternoon: string,
    slot_size_minutes: number
}

export type SpecialistFetchParams = {
    lat: number
    lng: number
    radius: number
}

export type FetchSpecialistResponse = {
    specialists: FindSpecialistItem[]
}