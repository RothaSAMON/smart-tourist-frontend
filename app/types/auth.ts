export interface AuthUser {
  id: number
  name: string
  email: string
  phone?: string | null
  status?: string
  user_type?: string
  roles: string[]
  avatarUrl?: string
}

export interface MeResponse {
  status?: string
  message?: string
  data: AuthUser
  success?: boolean
}

export interface AuthToken {
  accessToken: string
  tokenType: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  status: string
  message: string
  data: AuthUser
  token: AuthToken
  success: boolean
}

export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
}
