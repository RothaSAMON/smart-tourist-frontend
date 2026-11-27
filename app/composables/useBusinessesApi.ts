import type {
  ApiBusiness,
  ApiBusinessDetailResponse,
  ApiBusinessesListResponse,
  BusinessMutationPayload,
} from '@/types/business-api'

export function useBusinessesApi() {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()

  function getApiBase() {
    return String(config.public.apiBase || '').replace(/\/+$/, '')
  }

  function getJsonHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  function formatBody(payload: BusinessMutationPayload) {
    return {
      user_id: Number(payload.user_id),
      category: payload.category.trim(),
      name: payload.name.trim(),
      address: payload.address.trim(),
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      phone: payload.phone.trim(),
      website: payload.website.trim(),
    }
  }

  async function fetchBusinesses(page = 1) {
    const response = await $fetch<ApiBusinessesListResponse>(
      `${getApiBase()}/businesses`,
      {
        method: 'GET',
        headers: getJsonHeaders(),
        query: { page },
      },
    )

    const items: ApiBusiness[] = Array.isArray(response?.data)
      ? response.data
      : []

    return {
      items,
      meta: response?.meta ?? null,
      links: response?.links ?? null,
    }
  }

  async function fetchBusinessById(id: string | number) {
    const response = await $fetch<ApiBusinessDetailResponse>(
      `${getApiBase()}/businesses/${id}`,
      {
        method: 'GET',
        headers: getJsonHeaders(),
      },
    )

    return response?.data ?? null
  }

  async function createBusiness(payload: BusinessMutationPayload) {
    const response = await $fetch<ApiBusinessDetailResponse>(
      `${getApiBase()}/businesses`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formatBody(payload),
      },
    )
    return response?.data ?? null
  }

  async function updateBusiness(
    id: string | number,
    payload: BusinessMutationPayload,
  ) {
    const response = await $fetch<ApiBusinessDetailResponse>(
      `${getApiBase()}/businesses/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formatBody(payload),
      },
    )
    return response?.data ?? null
  }

  async function deleteBusiness(id: string | number) {
    await $fetch(`${getApiBase()}/businesses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
  }

  return {
    fetchBusinesses,
    fetchBusinessById,
    createBusiness,
    updateBusiness,
    deleteBusiness,
  }
}
