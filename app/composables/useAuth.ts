import { computed } from 'vue'
import type {
  ApiErrorPayload,
  AuthUser,
  LoginRequest,
  LoginResponse,
  MeResponse,
} from '@/types/auth'

export function useAuth() {
  const config = useRuntimeConfig()
  const store = useTourismStore()

  const accessToken = useCookie<string | null>('access_token', {
    sameSite: 'lax',
    default: () => null,
  })
  const tokenType = useCookie<string>('token_type', {
    sameSite: 'lax',
    default: () => 'Bearer',
  })
  const userCookie = useCookie<AuthUser | null>('auth_user', {
    sameSite: 'lax',
    default: () => null,
  })

  // Hydrate store from persisted cookie if present
  if (userCookie.value && !store.currentUser.value) {
    store.setAuthUser(userCookie.value)
  }

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  function getApiBase() {
    return String(config.public.apiBase || '').replace(/\/+$/, '')
  }

  function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (accessToken.value) {
      headers.Authorization = `${tokenType.value || 'Bearer'} ${accessToken.value}`
    }
    return headers
  }

  async function login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await $fetch<LoginResponse>(`${getApiBase()}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        email: payload.email.trim(),
        password: payload.password,
      },
    })

    if (!response.success || !response.token?.accessToken) {
      throw new Error(response.message || 'Login failed. Please try again.')
    }

    accessToken.value = response.token.accessToken
    tokenType.value = response.token.tokenType || 'Bearer'
    userCookie.value = response.data
    store.setAuthUser(response.data)

    return response
  }

  async function fetchMe(): Promise<AuthUser | null> {
    if (!accessToken.value) return null

    try {
      const response = await $fetch<MeResponse>(`${getApiBase()}/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (response?.data) {
        userCookie.value = response.data
        store.setAuthUser(response.data)
        return response.data
      }
      return userCookie.value
    } catch (err) {
      const status = (err as { statusCode?: number; status?: number })
      if (status?.statusCode === 401 || status?.status === 401) {
        logout()
      }
      return userCookie.value
    }
  }

  function logout() {
    accessToken.value = null
    tokenType.value = 'Bearer'
    userCookie.value = null
    store.logoutMock()
  }

  function resolveRedirectPath(user: AuthUser): string {
    const normalizedType = user.user_type?.toLowerCase()
    const normalizedRoles = (user.roles ?? []).map((r) => r.toLowerCase())

    if (normalizedType === 'admin' || normalizedRoles.includes('admin')) {
      return '/admin'
    }
    if (
      normalizedType === 'business' ||
      normalizedRoles.includes('business') ||
      normalizedRoles.includes('business owner')
    ) {
      return '/business'
    }
    return '/profile'
  }

  function extractError(err: unknown): {
    message: string
    fieldErrors: Record<string, string>
  } {
    const fetchErr = err as {
      data?: ApiErrorPayload
      statusMessage?: string
      message?: string
    }
    const payload = fetchErr?.data
    const fieldErrors: Record<string, string> = {}

    if (payload?.errors) {
      for (const [key, messages] of Object.entries(payload.errors)) {
        if (messages?.[0]) {
          fieldErrors[key] = messages[0]
        }
      }
    }

    const message =
      payload?.message ||
      fetchErr?.message ||
      fetchErr?.statusMessage ||
      'Unable to sign in. Please check your credentials and try again.'

    return { message, fieldErrors }
  }

  return {
    accessToken,
    tokenType,
    user: userCookie,
    isAuthenticated,
    getAuthHeaders,
    login,
    fetchMe,
    logout,
    resolveRedirectPath,
    extractError,
  }
}
