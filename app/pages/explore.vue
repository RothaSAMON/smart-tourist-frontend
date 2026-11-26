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
  title: 'Explore Cambodia Attractions — SmartTour',
})

const route = useRoute()
const store = useTourismStore()

const searchQuery = ref(String(route.query.q ?? ''))
const selectedProvince = ref(String(route.query.province ?? ''))
const selectedCategory = ref<DestinationCategory>('All')
const selectedTags = ref<VibeTag[]>([])
const budgetFilter = ref<'any' | 'free' | 'under15' | 'under40'>('any')
const minRating = ref<number>(0)
const maxDistanceKm = ref<number>(0)
const sortBy = ref<'popularity' | 'rating' | 'price' | 'distance'>('popularity')
const viewMode = ref<'grid' | 'map'>('grid')
const selectedMapId = ref<string>('angkor-wat')

function toggleTag(tag: VibeTag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    selectedTags.value = [...selectedTags.value, tag]
  }
}

function resetAll() {
  searchQuery.value = ''
  selectedProvince.value = ''
  selectedCategory.value = 'All'
  selectedTags.value = []
  budgetFilter.value = 'any'
  minRating.value = 0
  maxDistanceKm.value = 0
  sortBy.value = 'popularity'
}

const filteredAttractions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  const list = store.attractions.value.filter((item) => {
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.province.toLowerCase().includes(q) ||
      item.highlight.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)

    const matchesProvince =
      !selectedProvince.value || item.province === selectedProvince.value

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

    const matchesRating = item.rating >= minRating.value
    const matchesDistance =
      maxDistanceKm.value === 0 || item.distanceFromCenterKm <= maxDistanceKm.value

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
            <select
              v-model="selectedProvince"
              aria-label="Filter by province"
              class="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-ring"
            >
              <option value="">All Provinces</option>
              <option v-for="p in CAMBODIA_PROVINCES" :key="p" :value="p">
                {{ p }}
              </option>
            </select>

            <!-- Budget -->
            <select
              v-model="budgetFilter"
              aria-label="Filter by budget"
              class="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-ring"
            >
              <option value="any">Any Budget</option>
              <option value="free">Free Entry</option>
              <option value="under15">Under $15</option>
              <option value="under40">Under $40</option>
            </select>

            <!-- Min Rating -->
            <select
              v-model.number="minRating"
              aria-label="Filter by minimum rating"
              class="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-ring"
            >
              <option :value="0">Any Rating</option>
              <option :value="4.6">4.6+ Stars</option>
              <option :value="4.8">4.8+ Stars</option>
            </select>

            <!-- Max Distance -->
            <select
              v-model.number="maxDistanceKm"
              aria-label="Filter by distance"
              class="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-ring"
            >
              <option :value="0">Any Distance</option>
              <option :value="10">Within 10 km</option>
              <option :value="30">Within 30 km</option>
              <option :value="50">Within 50 km</option>
            </select>
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
              <select
                v-model="sortBy"
                aria-label="Sort attractions"
                class="h-9 rounded-full border border-input bg-background px-3.5 text-xs font-semibold outline-none"
              >
                <option value="popularity">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price">Sort: Lowest Ticket Price</option>
                <option value="distance">Sort: Nearest</option>
              </select>

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
