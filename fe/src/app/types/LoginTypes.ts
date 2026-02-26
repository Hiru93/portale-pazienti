import {
  type FormField,
  type OperatorEntity,
  type PatientEntity,
  type SpecialistEntity,
} from "@/app/types/CommonTypes"

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  user_data: BasicUserInfo
  auth_level: string
}

export type SignupRequest = {
  opInfo: OperatorEntity | null
  patInfo: PatientEntity | null
  specInfo: SpecialistEntity | null
}

export type SignupResponse = {
  message: string
}

export type BasicUserInfo = {
  first_name: string
  last_name: string
}

export type Role = {
  id: number
  description: string
}

export type SignupForm = FormField[]
