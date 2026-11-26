import { computed, ref } from 'vue'
import type { DestinationCategory, SearchFilters } from '@/types/tourism'

export function useTourismRecommendations() {
  const store = useTourismStore()
  const activeCategory = ref<DestinationCategory>('All')
  const searchFilters = ref<SearchFilters>({
    province: '',
    attraction: '',
  })

  const provinces = computed(() =>
    Array.from(new Set(store.attractions.value.map((item) => item.province))).sort(),
  )

  const filteredAttractions = computed(() => {
    const normalizedProvince = searchFilters.value.province.trim().toLowerCase()
    const normalizedAttraction = searchFilters.value.attraction.trim().toLowerCase()

    return store.attractions.value.filter((item) => {
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

  function setCategory(category: DestinationCategory) {
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
    provinces,
    activeCategory,
    searchFilters,
    filteredAttractions,
    setCategory,
    applySearch,
    resetFilters,
    isFavorite: store.isFavorite,
    toggleFavorite: store.toggleFavorite,
  }
}
