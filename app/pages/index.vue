<script setup lang="ts">
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
  provinces,
  activeCategory,
  searchFilters,
  filteredAttractions,
  setCategory,
  applySearch,
  resetFilters,
  isFavorite,
  toggleFavorite,
} = useTourismRecommendations()

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

      <!-- 2. Recommended Attractions Grid -->
      <HomeRecommendations
        :attractions="filteredAttractions"
        :active-category="activeCategory"
        :search-filters="searchFilters"
        :is-favorite="isFavorite"
        @select-category="setCategory"
        @reset-filters="resetFilters"
        @toggle-favorite="toggleFavorite"
      />

      <!-- 3. What Makes SmartTour Unique -->
      <HomeFeatures />

      <!-- 4. Award-Winning Spotlight Showcase -->
      <HomeAwardShowcase />

      <!-- 5. Customer Testimonials -->
      <HomeTestimonials />
    </main>

    <LayoutAppFooter />
  </div>
</template>
