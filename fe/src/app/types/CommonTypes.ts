export type AuthLevels = {
  basic: string[],
  operator: string[],
  admin: string[]
}

export type DecodedToken = {
  exp: number,
  iat: number,
  user_auth: string[],
  user_email: string,
  user_id: number,
  user_data: {
    first_name: string,
    last_name: string,
  }
}

export type BaseResponse<T> = {
  data?: T,
  error?: HttpError
}

type HttpError = {
  code: number,
  error: string,
  response: object | null
}

export type PasswordStrengthOptions = {
  id: number
  value: string
  minDiversity: number
  minLength: number
}

export type BasicErrorMessages = Record<string, string>

export type OperatorEntity = {
  email: string, 
  password: string, 
  first_name: string, 
  last_name: string,
}

export type PatientEntity = {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  cap: number,
  city: string,
  state: string,
  address: string,
  cod_fisc: string,
  birth_date: string,
  sex: string,
  phone: number,
  birth_place: string,
}

export type SpecialistEntity = {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  cap: number,
  city: string,
  state: string,
  address: string,
  cod_fisc: string,
  birth_date: string,
  sex: string,
  phone: number,
  p_iva: string,
  title: string,
  specialization: string,
  clinic_name: string,
  clinic_cap: number,
  clinic_city: string,
  clinic_address: string,
  clinic_phone: number
}

export type FormField = {
  label: string
  type: 'text' | 'number' | 'date' | 'select'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  options?: { value: string; label: string }[]
}
