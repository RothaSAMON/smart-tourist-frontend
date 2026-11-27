<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  LayoutGrid,
  Map as MapIcon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from '@lucide/vue'
import {
  CAMBODIA_PROVINCES,
  DESTINATION_CATEGORIES,
  VIBE_TAGS,
} from '@/data/home'
import type { DestinationCategory, VibeTag } from '@/types/tourism'

useHead({
  title: 'Explore Cambodia Attractions — RokMerl',
})

const route = useRoute()
const store = useTourismStore()

const searchQuery = ref(String(route.query.q ?? ''))
const selectedProvince = ref(String(route.query.province || 'all'))
const selectedCategory = ref<DestinationCategory>('All')
const selectedTags = ref<VibeTag[]>([])
const budgetFilter = ref<'any' | 'free' | 'under15' | 'under40'>('any')
const minRating = ref<string>('0')
const maxDistanceKm = ref<string>('0')
const sortBy = ref<'popularity' | 'rating' | 'price' | 'distance'>('popularity')
const viewMode = ref<'grid' | 'map'>('grid')
const selectedMapId = ref<string>('angkor-wat')

const provinceOptions = [
  { label: 'All Provinces', value: 'all' },
  ...CAMBODIA_PROVINCES.map((p) => ({ label: p, value: p })),
]
const budgetOptions = [
  { label: 'Any Budget', value: 'any' },
  { label: 'Free Entry', value: 'free' },
  { label: 'Under $15', value: 'under15' },
  { label: 'Under $40', value: 'under40' },
]
const ratingOptions = [
  { label: 'Any Rating', value: '0' },
  { label: '4.6+ Stars', value: '4.6' },
  { label: '4.8+ Stars', value: '4.8' },
]
const distanceOptions = [
  { label: 'Any Distance', value: '0' },
  { label: 'Within 10 km', value: '10' },
  { label: 'Within 30 km', value: '30' },
  { label: 'Within 50 km', value: '50' },
]
const sortOptions = [
  { label: 'Sort: Most Popular', value: 'popularity' },
  { label: 'Sort: Highest Rated', value: 'rating' },
  { label: 'Sort: Lowest Ticket Price', value: 'price' },
  { label: 'Sort: Nearest', value: 'distance' },
]

function toggleTag(tag: VibeTag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    selectedTags.value = [...selectedTags.value, tag]
  }
}

function resetAll() {
  searchQuery.value = ''
  selectedProvince.value = 'all'
  selectedCategory.value = 'All'
  selectedTags.value = []
  budgetFilter.value = 'any'
  minRating.value = '0'
  maxDistanceKm.value = '0'
  sortBy.value = 'popularity'
}

const filteredAttractions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const minRatingNum = Number(minRating.value)
  const maxDistanceNum = Number(maxDistanceKm.value)

  const list = store.attractions.value.filter((item) => {
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.province.toLowerCase().includes(q) ||
      item.highlight.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)

    const matchesProvince =
      selectedProvince.value === 'all' || item.province === selectedProvince.value

    const matchesCategory =
      selectedCategory.value === 'All' || item.category === selectedCategory.value

    const matchesTags =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((tag) => item.tags.includes(tag))

    const matchesBudget =
      budgetFilter.value === 'any' ||
      (budgetFilter.value === 'free' && item.ticketPriceUsd === 0) ||
      (budgetFilter.value === 'under15' && item.ticketPriceUsd <= 15) ||
      (budgetFilter.value === 'under40' && item.ticketPriceUsd <= 40)

    const matchesRating = item.rating >= minRatingNum
    const matchesDistance =
      maxDistanceNum === 0 || item.distanceFromCenterKm <= maxDistanceNum

    return (
      matchesQuery &&
      matchesProvince &&
      matchesCategory &&
      matchesTags &&
      matchesBudget &&
      matchesRating &&
      matchesDistance
    )
  })

  return [...list].sort((a, b) => {
    if (sortBy.value === 'rating') return b.rating - a.rating
    if (sortBy.value === 'price') return a.ticketPriceUsd - b.ticketPriceUsd
    if (sortBy.value === 'distance') {
      return a.distanceFromCenterKm - b.distanceFromCenterKm
    }
    return b.popularityScore - a.popularityScore
  })
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header Banner -->
      <div
        class="flex flex-col justify-between gap-5 rounded-3xl bg-surface-sky p-6 sm:p-8 lg:flex-row lg:items-center"
      >
        <div>
          <UiBadge variant="brand" class="mb-3 font-semibold">
            Destination Discovery · Cambodia
          </UiBadge>
          <h1 class="text-2xl font-bold tracking-tight sm:text-4xl">
            Explore Attractions Across Cambodia
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Filter by province, category, travel vibe, budget, rating, and distance — or switch to Interactive Map mode.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <NuxtLink to="/planner">
            <UiButton variant="brand" class="font-semibold">
              <Sparkles class="size-4" />
              Build AI Itinerary
            </UiButton>
          </NuxtLink>
          <div class="inline-flex rounded-full border border-border bg-white p-1">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
              :class="
                viewMode === 'grid'
                  ? 'bg-neutral-900 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              "
              @click="viewMode = 'grid'"
            >
              <LayoutGrid class="size-3.5" />
              Grid
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
              :class="
                viewMode === 'map'
                  ? 'bg-neutral-900 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              "
              @click="viewMode = 'map'"
            >
              <MapIcon class="size-3.5" />
              Map View
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <UiCard class="mt-6">
        <UiCardContent class="space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <!-- Search -->
            <div class="relative lg:col-span-2">
              <Search class="pointer-events-none absolute top-3 left-3.5 size-4 text-muted-foreground" />
              <UiInput
                v-model="searchQuery"
                placeholder="Search attraction (e.g. Angkor Wat)..."
                class="pl-10"
              />
            </div>

            <!-- Province -->
            <CommonSearchableSelect
              v-model="selectedProvince"
              :options="provinceOptions"
              placeholder="All Provinces"
              search-placeholder="Search province..."
              aria-label="Filter by province"
            />

            <!-- Budget -->
            <CommonSearchableSelect
              v-model="budgetFilter"
              :options="budgetOptions"
              placeholder="Any Budget"
              search-placeholder="Search budget..."
              aria-label="Filter by budget"
            />

            <!-- Min Rating -->
            <CommonSearchableSelect
              v-model="minRating"
              :options="ratingOptions"
              placeholder="Any Rating"
              search-placeholder="Search rating..."
              aria-label="Filter by minimum rating"
            />

            <!-- Max Distance -->
            <CommonSearchableSelect
              v-model="maxDistanceKm"
              :options="distanceOptions"
              placeholder="Any Distance"
              search-placeholder="Search distance..."
              aria-label="Filter by distance"
            />
          </div>

          <!-- Category Pills & Sort -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div class="flex flex-wrap items-center gap-2">
              <UiButton
                v-for="cat in DESTINATION_CATEGORIES"
                :key="cat"
                size="sm"
                :variant="selectedCategory === cat ? 'brand' : 'outline'"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </UiButton>
            </div>

            <div class="flex items-center gap-2">
              <SlidersHorizontal class="size-4 text-muted-foreground" />
              <div class="w-[190px]">
                <CommonSearchableSelect
                  v-model="sortBy"
                  :options="sortOptions"
                  placeholder="Sort by"
                  search-placeholder="Search sort..."
                  aria-label="Sort attractions"
                  trigger-class="h-9 rounded-full text-xs font-semibold"
                />
              </div>

              <UiButton variant="ghost" size="sm" @click="resetAll">
                <RotateCcw class="size-3.5" />
                Reset
              </UiButton>
            </div>
          </div>

          <!-- Travel Vibe Tags -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium text-muted-foreground">Vibe:</span>
            <button
              v-for="tag in VIBE_TAGS"
              :key="tag"
              type="button"
              class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              :class="
                selectedTags.includes(tag)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-border bg-muted/40 text-foreground hover:bg-muted'
              "
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Results Count -->
      <div class="mt-6 flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Showing <span class="font-semibold text-foreground">{{ filteredAttractions.length }}</span>
          attractions in Cambodia
        </p>
      </div>

      <!-- Content Area -->
      <div
        v-if="filteredAttractions.length > 0"
        class="mt-5"
        :class="
          viewMode === 'map'
            ? 'grid grid-cols-1 gap-6 lg:grid-cols-12'
            : ''
        "
      >
        <!-- Cards Grid -->
        <div
          :class="
            viewMode === 'map'
              ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7'
              : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          "
        >
          <div
            v-for="attraction in filteredAttractions"
            :key="attraction.id"
            @mouseenter="selectedMapId = attraction.id"
          >
            <HomeDestinationCard
              :attraction="attraction"
              :is-favorite="store.isFavorite(attraction.id)"
              @toggle-favorite="store.toggleFavorite"
            />
          </div>
        </div>

        <!-- Sticky Map Panel -->
        <div v-if="viewMode === 'map'" class="lg:col-span-5">
          <div class="lg:sticky lg:top-24">
            <ExploreInteractiveMapPanel
              :attractions="filteredAttractions"
              :selected-id="selectedMapId"
              @select="selectedMapId = $event"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center"
      >
        <p class="text-base font-semibold">No attractions match these filters</p>
        <p class="mt-1 text-sm text-muted-foreground">
          Try widening your budget, distance, or vibe tags.
        </p>
        <UiButton variant="brand" size="sm" class="mt-4" @click="resetAll">
          Reset All Filters
        </UiButton>
      </div>
    </main>

    <LayoutAppFooter />
  </div>
</template>
