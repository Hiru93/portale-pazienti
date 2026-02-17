export interface UserInfo {
  email: string;
  password: string;
  deleted?: boolean;
  id_role?: number;
  first_name?: string;
  last_name?: string;
  cap?: number;
  city?: string;
  state?: string;
  address?: string;
  p_iva?: string;
  cod_fisc?: string;
  birth_date?: string;
  birth_place?: string;
  sex?: string;
  phone?: string;
  title?: string;
  specialization?: string;
  clinic_name?: string;
  clinic_cap?: number;
  clinic_city?: string;
  clinic_address?: string;
  clinic_phone?: string;
}

export interface RegisterInfoSuccess {
  opInfo: { userId: string; credId: string } | null;
  patInfo: { userId: string; credId: string } | null;
  specInfo: { userId: string; credId: string } | null;
}
