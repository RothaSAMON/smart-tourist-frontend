import { computed, ref } from 'vue'
import type { ApiBusiness } from '@/types/business-api'
import type { DestinationAttraction, SearchFilters } from '@/types/tourism'

export function useTourismRecommendations() {
  const store = useTourismStore()
  const { fetchAttractions } = useAttractionsApi()
  const { fetchBusinesses } = useBusinessesApi()

  const attractions = ref<DestinationAttraction[]>([])
  const businesses = ref<ApiBusiness[]>([])

  const isLoadingAttractions = ref(true)
  const isLoadingBusinesses = ref(true)
  const attractionsError = ref('')
  const businessesError = ref('')

  const activeCategory = ref<string>('All')
  const searchFilters = ref<SearchFilters>({
    province: '',
    attraction: '',
  })

  async function loadAttractions() {
    isLoadingAttractions.value = true
    attractionsError.value = ''
    try {
      const res = await fetchAttractions(1)
      attractions.value = Array.isArray(res?.items) ? res.items : []
    } catch (err) {
      const fetchErr = err as { data?: { message?: string }; message?: string }
      attractionsError.value =
        fetchErr?.data?.message ||
        fetchErr?.message ||
        'Unable to load attractions from server.'
    } finally {
      isLoadingAttractions.value = false
    }
  }

  async function loadBusinesses() {
    isLoadingBusinesses.value = true
    businessesError.value = ''
    try {
      const res = await fetchBusinesses(1)
      businesses.value = Array.isArray(res?.items) ? res.items : []
    } catch (err) {
      const fetchErr = err as { data?: { message?: string }; message?: string }
      businessesError.value =
        fetchErr?.data?.message ||
        fetchErr?.message ||
        'Unable to load businesses from server.'
    } finally {
      isLoadingBusinesses.value = false
    }
  }

  async function loadHomeData() {
    await Promise.allSettled([loadAttractions(), loadBusinesses()])
  }

  const provinces = computed(() =>
    Array.from(new Set(attractions.value.map((item) => item.province))).sort(),
  )

  const categories = computed(() => {
    const unique = Array.from(
      new Set(attractions.value.map((item) => item.category)),
    ).sort()
    return ['All', ...unique]
  })

  const filteredAttractions = computed(() => {
    const normalizedProvince = searchFilters.value.province.trim().toLowerCase()
    const normalizedAttraction = searchFilters.value.attraction.trim().toLowerCase()

    return attractions.value.filter((item) => {
      const matchesCategory =
        activeCategory.value === 'All' || item.category === activeCategory.value

      const matchesProvince =
        !normalizedProvince ||
        item.province.toLowerCase() === normalizedProvince

      const matchesAttraction =
        !normalizedAttraction ||
        item.name.toLowerCase().includes(normalizedAttraction) ||
        item.location.toLowerCase().includes(normalizedAttraction) ||
        item.highlight.toLowerCase().includes(normalizedAttraction)

      return matchesCategory && matchesProvince && matchesAttraction
    })
  })

  const topRatedAttractions = computed(() =>
    [...attractions.value]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5),
  )

  function setCategory(category: string) {
    activeCategory.value = category
  }

  function applySearch(filters: SearchFilters) {
    searchFilters.value = { ...filters }
  }

  function resetFilters() {
    activeCategory.value = 'All'
    searchFilters.value = {
      province: '',
      attraction: '',
    }
  }

  return {
    attractions,
    businesses,
    isLoadingAttractions,
    isLoadingBusinesses,
    attractionsError,
    businessesError,
    provinces,
    categories,
    activeCategory,
    searchFilters,
    filteredAttractions,
    topRatedAttractions,
    loadHomeData,
    loadAttractions,
    loadBusinesses,
    setCategory,
    applySearch,
    resetFilters,
    isFavorite: store.isFavorite,
    toggleFavorite: store.toggleFavorite,
  }
}
