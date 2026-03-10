export type FindSpecialistItem = {
    id: string
    name: string
    lat: number
    lng: number
    visible: boolean
}

export type SpecialistFetchParams = {
    lat: number
    lng: number
    radius: number
}

export type FetchSpecialistResponse = {
    specialists: FindSpecialistItem[]
}