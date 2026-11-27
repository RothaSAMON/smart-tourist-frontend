import type { ApiPaginationMeta } from '@/types/attraction-api'

export interface ApiBusinessOwner {
  id: number
  name: string
  email?: string
}

export interface ApiBusiness {
  id: number
  user_id: number
  user?: ApiBusinessOwner | null
  category: string
  name: string
  address: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  status?: string | null
  created_at?: string
  updated_at?: string
}

export interface BusinessMutationPayload {
  user_id: number | string
  category: string
  name: string
  address: string
  latitude: number | string
  longitude: number | string
  phone: string
  website: string
}

export interface ApiBusinessesListResponse {
  data: ApiBusiness[]
  links?: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta?: ApiPaginationMeta
}

export interface ApiBusinessDetailResponse {
  data: ApiBusiness
}
