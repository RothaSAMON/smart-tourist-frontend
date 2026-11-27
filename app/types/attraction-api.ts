export interface ApiProvince {
  id: number
  name: string
}

export interface ApiCategory {
  id: number
  name: string
}

export interface ApiAttraction {
  id: number
  province_id: number
  category_id: number
  province: ApiProvince | null
  category: ApiCategory | null
  name: string
  description: string | null
  latitude: number | null
  longitude: number | null
  address: string | null
  opening_hour: string | null
  closing_hour: string | null
  entrance_fee: number | null
  average_rating: number | null
  image: string | null
  image_url: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiPaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export interface ApiPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: ApiPaginationLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface ApiAttractionsListResponse {
  data: ApiAttraction[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: ApiPaginationMeta
}

export interface ApiAttractionDetailResponse {
  data: ApiAttraction
}

export interface AttractionMutationPayload {
  province_id: number | string
  category_id: number | string
  name: string
  description: string
  latitude: number | string
  longitude: number | string
  address: string
  opening_hour: string
  closing_hour: string
  entrance_fee: number | string
  average_rating: number | string
  image?: File | null
}
