<script setup lang="ts">
import { onMounted } from 'vue'
import type { SearchFilters } from '@/types/tourism'

useHead({
  title: 'RokMerl — Cambodia Smart Tourism Recommendations Platform',
  meta: [
    {
      name: 'description',
      content:
        'Discover smart tourism recommendations across Cambodia — from Angkor Wat and Phnom Penh Royal Palace to Koh Rong islands and Bokor National Park.',
    },
  ],
})

const {
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
  isFavorite,
  toggleFavorite,
} = useTourismRecommendations()

onMounted(() => {
  loadHomeData()
})

function handleHeroSearch(filters: SearchFilters) {
  applySearch(filters)
  if (import.meta.client) {
    document
      .getElementById('recommendations')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- 1. Hero & Floating Search -->
      <HomeHero
        :search-filters="searchFilters"
        :provinces="provinces"
        @search="handleHeroSearch"
      />

      <!-- 2. Live Recommended Attractions Grid (/attractions) -->
      <HomeRecommendations
        :attractions="filteredAttractions"
        :categories="categories"
        :active-category="activeCategory"
        :search-filters="searchFilters"
        :is-loading="isLoadingAttractions"
        :error-message="attractionsError"
        :is-favorite="isFavorite"
        @select-category="setCategory"
        @reset-filters="resetFilters"
        @toggle-favorite="toggleFavorite"
        @retry="loadAttractions"
      />

      <!-- 3. Live Local Businesses & Services (/businesses) -->
      <HomeBusinesses
        :businesses="businesses"
        :is-loading="isLoadingBusinesses"
        :error-message="businessesError"
        @retry="loadBusinesses"
      />

      <!-- 4. What Makes RokMerl Unique -->
      <HomeFeatures />

      <!-- 5. Top-Rated Live Spotlight Showcase -->
      <HomeAwardShowcase
        :attractions="topRatedAttractions"
        :is-loading="isLoadingAttractions"
        :is-favorite="isFavorite"
        @toggle-favorite="toggleFavorite"
      />

      <!-- 6. Customer Testimonials -->
      <HomeTestimonials />
    </main>

    <LayoutAppFooter />
  </div>
</template>
