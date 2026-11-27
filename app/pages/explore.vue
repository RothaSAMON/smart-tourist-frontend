<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Map as MapIcon,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from '@lucide/vue'
import { VIBE_TAGS } from '@/data/home'
import type { ApiPaginationMeta } from '@/types/attraction-api'
import type { DestinationAttraction, VibeTag } from '@/types/tourism'

useHead({
  title: 'Explore Cambodia Attractions — RokMerl',
})

const route = useRoute()
const store = useTourismStore()
const { fetchAttractions } = useAttractionsApi()

const attractions = ref<DestinationAttraction[]>([])
const paginationMeta = ref<ApiPaginationMeta | null>(null)
const currentPage = ref(Number(route.query.page ?? 1) || 1)
const isLoading = ref(true)
const errorMessage = ref('')

const searchQuery = ref(String(route.query.q ?? ''))
const selectedProvince = ref(String(route.query.province || 'all'))
const selectedCategory = ref<string>('All')
const selectedTags = ref<VibeTag[]>([])
const budgetFilter = ref<'any' | 'free' | 'under15' | 'under40'>('any')
const minRating = ref<string>('0')
const sortBy = ref<'popularity' | 'rating' | 'price'>('popularity')
const viewMode = ref<'grid' | 'map'>('grid')
const selectedMapId = ref<string>('')

const provinceOptions = computed(() => {
  const unique = Array.from(
    new Set(attractions.value.map((a) => a.province)),
  ).sort()
  return [
    { label: 'All Provinces', value: 'all' },
    ...unique.map((p) => ({ label: p, value: p })),
  ]
})

const categoryList = computed(() => {
  const unique = Array.from(
    new Set(attractions.value.map((a) => a.category)),
  ).sort()
  return ['All', ...unique]
})

const budgetOptions = [
  { label: 'Any Budget', value: 'any' },
  { label: 'Free Entry', value: 'free' },
  { label: 'Under $15', value: 'under15' },
  { label: 'Under $40', value: 'under40' },
]
const ratingOptions = [
  { label: 'Any Rating', value: '0' },
  { label: '4.5+ Stars', value: '4.5' },
  { label: '4.8+ Stars', value: '4.8' },
]
const sortOptions = [
  { label: 'Sort: Most Popular', value: 'popularity' },
  { label: 'Sort: Highest Rated', value: 'rating' },
  { label: 'Sort: Lowest Ticket Price', value: 'price' },
]

async function loadAttractions(page = currentPage.value) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await fetchAttractions(page)
    attractions.value = result.items
    paginationMeta.value = result.meta
    currentPage.value = result.meta?.current_page ?? page
    if (result.items.length > 0 && !selectedMapId.value) {
      selectedMapId.value = result.items[0]!.id
    }
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    errorMessage.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Unable to load attractions from the server.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAttractions(currentPage.value)
})

function goToPage(page: number) {
  if (
    !paginationMeta.value ||
    page < 1 ||
    page > paginationMeta.value.last_page ||
    page === currentPage.value
  ) {
    return
  }
  loadAttractions(page)
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

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
  sortBy.value = 'popularity'
}

const filteredAttractions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const minRatingNum = Number(minRating.value)

  const list = attractions.value.filter((item) => {
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.province.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
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

    return (
      matchesQuery &&
      matchesProvince &&
      matchesCategory &&
      matchesTags &&
      matchesBudget &&
      matchesRating
    )
  })

  return [...list].sort((a, b) => {
    if (sortBy.value === 'rating') return b.rating - a.rating
    if (sortBy.value === 'price') return a.ticketPriceUsd - b.ticketPriceUsd
    return b.popularityScore - a.popularityScore
  })
})

watch(filteredAttractions, (list) => {
  if (list.length > 0 && !list.some((item) => item.id === selectedMapId.value)) {
    selectedMapId.value = list[0]!.id
  }
})

const pageNumbers = computed(() => {
  const last = paginationMeta.value?.last_page ?? 1
  return Array.from({ length: last }, (_, idx) => idx + 1)
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
            Filter live attractions by province, category, travel vibe, budget, and rating — or switch to Interactive Map mode.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <NuxtLink to="/planner">
            <UiButton variant="brand" class="font-semibold">
              <Sparkles class="size-4" />
              Build AI Itinerary
            </UiButton>
          </NuxtLink>
          <div class="inline-flex rounded-full border border-border bg-card p-1">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
              :class="
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
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
                  ? 'bg-primary text-primary-foreground'
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
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
          </div>

          <!-- Category Pills & Sort -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div class="flex flex-wrap items-center gap-2">
              <UiButton
                v-for="cat in categoryList"
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
                  ? 'border-primary bg-primary text-primary-foreground'
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
      <div class="mt-6 flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-muted-foreground">
          Showing
          <span class="font-semibold text-foreground">{{ filteredAttractions.length }}</span>
          attractions
          <span v-if="paginationMeta">
            (Page {{ paginationMeta.current_page }} of {{ paginationMeta.last_page }} ·
            {{ paginationMeta.total }} total)
          </span>
        </p>
      </div>

      <!-- Error State -->
      <div
        v-if="errorMessage"
        class="mt-6 flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-10 text-center"
      >
        <AlertCircle class="size-8 text-destructive" />
        <p class="mt-3 text-sm font-semibold text-destructive">
          {{ errorMessage }}
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-2.5">
          <UiButton variant="brand" size="sm" @click="loadAttractions(currentPage)">
            <RefreshCw class="size-3.5" />
            Try Again
          </UiButton>
          <NuxtLink to="/auth/login">
            <UiButton variant="outline" size="sm">Log in</UiButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div
        v-else-if="isLoading"
        class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="n in 6"
          :key="n"
          class="h-[340px] animate-pulse rounded-2xl bg-muted"
        />
      </div>

      <!-- Content Area -->
      <div
        v-else-if="filteredAttractions.length > 0"
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
          Try widening your budget, rating, or vibe tags.
        </p>
        <UiButton variant="brand" size="sm" class="mt-4" @click="resetAll">
          Reset All Filters
        </UiButton>
      </div>

      <!-- Pagination Controls -->
      <nav
        v-if="!isLoading && !errorMessage && paginationMeta && paginationMeta.last_page > 1"
        aria-label="Attractions pagination"
        class="mt-10 flex items-center justify-center gap-2"
      >
        <UiButton
          variant="outline"
          size="sm"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft class="size-4" />
          Previous
        </UiButton>

        <UiButton
          v-for="page in pageNumbers"
          :key="page"
          size="sm"
          :variant="page === currentPage ? 'brand' : 'outline'"
          class="min-w-9 px-3 font-semibold"
          @click="goToPage(page)"
        >
          {{ page }}
        </UiButton>

        <UiButton
          variant="outline"
          size="sm"
          :disabled="currentPage >= paginationMeta.last_page"
          @click="goToPage(currentPage + 1)"
        >
          Next
          <ChevronRight class="size-4" />
        </UiButton>
      </nav>
    </main>

    <LayoutAppFooter />
  </div>
</template>
