import type {
  ApiAttraction,
  ApiAttractionDetailResponse,
  ApiAttractionsListResponse,
  AttractionMutationPayload,
} from '@/types/attraction-api'
import type { DestinationAttraction, VibeTag } from '@/types/tourism'

export const DEFAULT_ATTRACTION_IMAGE = '/images/attraction-placeholder.svg'

function formatTime24To12(time: string | null): string {
  if (!time) return ''
  const [hourStr, minuteStr] = time.split(':')
  const hour = Number(hourStr)
  if (Number.isNaN(hour)) return time
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${String(hour12).padStart(2, '0')}:${minuteStr || '00'} ${suffix}`
}

function inferTags(categoryName: string): VibeTag[] {
  const lower = categoryName.toLowerCase()
  const tags: VibeTag[] = []
  if (lower.includes('temple') || lower.includes('histor') || lower.includes('cultur')) {
    tags.push('Culture', 'Family Friendly')
  }
  if (lower.includes('nature') || lower.includes('park') || lower.includes('water') || lower.includes('island') || lower.includes('beach')) {
    tags.push('Nature', 'Adventure')
  }
  if (lower.includes('food') || lower.includes('market')) {
    tags.push('Local Food')
  }
  if (lower.includes('night')) {
    tags.push('Nightlife')
  }
  return tags.length > 0 ? tags : ['Culture', 'Family Friendly']
}

export function mapApiAttraction(item: ApiAttraction): DestinationAttraction {
  const provinceName = item.province?.name || 'Cambodia'
  const categoryName = item.category?.name || 'Attraction'
  const fee = Number(item.entrance_fee ?? 0)
  const rating = Number(item.average_rating ?? 0)
  const primaryImage = item.image_url || item.image || DEFAULT_ATTRACTION_IMAGE

  const openText = formatTime24To12(item.opening_hour)
  const closeText = formatTime24To12(item.closing_hour)
  const openingHours =
    openText && closeText ? `${openText} – ${closeText}` : 'Daily'

  return {
    id: String(item.id),
    name: item.name,
    province: provinceName,
    location: item.address || `${provinceName}, Cambodia`,
    address: item.address || `${provinceName}, Cambodia`,
    category: categoryName,
    tags: inferTags(categoryName),
    duration: 'Half Day',
    bestTime: openText ? `Opens ${openText}` : 'Morning',
    highlight: categoryName,
    entryFee: fee > 0 ? `$${fee}/entry` : 'Free Entry',
    ticketPriceUsd: fee,
    popularityScore: Math.round(rating * 20),
    distanceFromCenterKm: 5,
    rating: rating || 4.5,
    reviewCount: 0,
    imageUrl: primaryImage,
    gallery: [primaryImage],
    videoPreviewUrl: 'https://www.youtube.com/embed/5_9F0z2mX3k',
    description:
      item.description ||
      `Explore ${item.name} located in ${provinceName}, Cambodia.`,
    history:
      item.description ||
      `${item.name} is a notable destination in ${provinceName}, Cambodia.`,
    openingHours,
    coordinates: {
      lat: Number(item.latitude ?? 12.5657),
      lng: Number(item.longitude ?? 104.991),
    },
    weather: {
      tempC: 30,
      condition: 'Partly Sunny',
      humidity: 68,
      bestSeason: 'Nov – Feb',
    },
    nearbyRestaurants: [],
    nearbyHotels: [],
  }
}

export function useAttractionsApi() {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()

  function getApiBase() {
    return String(config.public.apiBase || '').replace(/\/+$/, '')
  }

  function getMultipartHeaders(): Record<string, string> {
    const headers = getAuthHeaders()
    const { 'Content-Type': _, ...rest } = headers
    return rest
  }

  function buildFormData(payload: AttractionMutationPayload): FormData {
    const fd = new FormData()
    fd.append('province_id', String(payload.province_id))
    fd.append('category_id', String(payload.category_id))
    fd.append('name', payload.name.trim())
    fd.append('description', payload.description.trim())
    fd.append('latitude', String(payload.latitude))
    fd.append('longitude', String(payload.longitude))
    fd.append('address', payload.address.trim())
    fd.append('opening_hour', payload.opening_hour.trim())
    fd.append('closing_hour', payload.closing_hour.trim())
    fd.append('entrance_fee', String(payload.entrance_fee))
    fd.append('average_rating', String(payload.average_rating))
    if (payload.image) {
      fd.append('image', payload.image)
    }
    return fd
  }

  async function fetchAttractions(page = 1) {
    const response = await $fetch<ApiAttractionsListResponse>(
      `${getApiBase()}/attractions`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
        query: { page },
      },
    )

    const raw = Array.isArray(response?.data) ? response.data : []
    return {
      raw,
      items: raw.map(mapApiAttraction),
      meta: response?.meta ?? null,
      links: response?.links ?? null,
    }
  }

  async function fetchAttractionById(id: string | number) {
    const response = await $fetch<ApiAttractionDetailResponse>(
      `${getApiBase()}/attractions/${id}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )

    return response?.data ? mapApiAttraction(response.data) : null
  }

  async function createAttraction(payload: AttractionMutationPayload) {
    const formData = buildFormData(payload)
    const response = await $fetch<ApiAttractionDetailResponse>(
      `${getApiBase()}/attractions`,
      {
        method: 'POST',
        headers: getMultipartHeaders(),
        body: formData,
      },
    )
    return response.data
  }

  async function updateAttraction(
    id: string | number,
    payload: AttractionMutationPayload,
  ) {
    if (payload.image) {
      const formData = buildFormData(payload)
      formData.append('_method', 'PUT')
      const response = await $fetch<ApiAttractionDetailResponse>(
        `${getApiBase()}/attractions/${id}`,
        {
          method: 'POST',
          headers: getMultipartHeaders(),
          body: formData,
        },
      )
      return response.data
    }

    const response = await $fetch<ApiAttractionDetailResponse>(
      `${getApiBase()}/attractions/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: {
          province_id: Number(payload.province_id),
          category_id: Number(payload.category_id),
          name: payload.name.trim(),
          description: payload.description.trim(),
          latitude: Number(payload.latitude),
          longitude: Number(payload.longitude),
          address: payload.address.trim(),
          opening_hour: payload.opening_hour.trim(),
          closing_hour: payload.closing_hour.trim(),
          entrance_fee: Number(payload.entrance_fee),
          average_rating: Number(payload.average_rating),
        },
      },
    )
    return response.data
  }

  async function deleteAttraction(id: string | number) {
    await $fetch(`${getApiBase()}/attractions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
  }

  return {
    fetchAttractions,
    fetchAttractionById,
    createAttraction,
    updateAttraction,
    deleteAttraction,
  }
}
