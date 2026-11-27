<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BookmarkCheck,
  Calendar,
  CloudSun,
  DollarSign,
  MapPin,
  Sparkles,
  Utensils,
  Wand2,
} from '@lucide/vue'
import { CAMBODIA_PROVINCES, INITIAL_SAVED_PLANS, VIBE_TAGS } from '@/data/home'
import type { ItineraryDay, SavedTripPlan, VibeTag } from '@/types/tourism'

useHead({
  title: 'AI Trip Planner — RokMerl',
})

const route = useRoute()
const store = useTourismStore()

const promptInput = ref(
  'I have 3 days in Siem Reap with a budget of $250. I like nature and local food.',
)
const selectedProvince = ref(
  String(route.query.province ?? 'Siem Reap'),
)
const daysCount = ref(3)
const budgetUsd = ref(250)
const season = ref('Dry / Cool (Nov – Feb)')
const selectedInterests = ref<VibeTag[]>(['Nature', 'Local Food', 'Culture'])

const provinceOptions = CAMBODIA_PROVINCES.map((p) => ({ label: p, value: p }))
const seasonOptions = [
  { label: 'Dry / Cool (Nov – Feb)', value: 'Dry / Cool (Nov – Feb)' },
  { label: 'Hot & Sunny (Mar – May)', value: 'Hot & Sunny (Mar – May)' },
  { label: 'Green Season (Jun – Oct)', value: 'Green Season (Jun – Oct)' },
]

const isGenerating = ref(false)
const planSavedNotice = ref(false)
const generatedPlan = ref<SavedTripPlan>(INITIAL_SAVED_PLANS[0]!)

const examplePrompts = [
  {
    label: '3 days in Siem Reap · $250 · Nature & Food',
    prompt:
      'I have 3 days in Siem Reap with a budget of $250. I like nature and local food.',
    province: 'Siem Reap',
    days: 3,
    budget: 250,
    interests: ['Nature', 'Local Food', 'Culture'] as VibeTag[],
  },
  {
    label: '2 days in Kampot & Kep · $180 · Family & Seafood',
    prompt:
      'I have 2 days in Kampot with a budget of $180. I love nature, family friendly stops, and local food.',
    province: 'Kampot',
    days: 2,
    budget: 180,
    interests: ['Nature', 'Family Friendly', 'Local Food'] as VibeTag[],
  },
  {
    label: '2 days in Preah Sihanouk · $220 · Island & Adventure',
    prompt:
      'I have 2 days in Preah Sihanouk with $220 for islands, snorkeling, and beachfront seafood.',
    province: 'Preah Sihanouk',
    days: 2,
    budget: 220,
    interests: ['Nature', 'Adventure', 'Local Food'] as VibeTag[],
  },
  {
    label: '2 days in Phnom Penh · $150 · Culture & Nightlife',
    prompt:
      '2 days in Phnom Penh with a $150 budget focusing on Khmer heritage, cafes, and riverfront dining.',
    province: 'Phnom Penh',
    days: 2,
    budget: 150,
    interests: ['Culture', 'Local Food', 'Nightlife'] as VibeTag[],
  },
]

function applyExample(ex: (typeof examplePrompts)[number]) {
  promptInput.value = ex.prompt
  selectedProvince.value = ex.province
  daysCount.value = ex.days
  budgetUsd.value = ex.budget
  selectedInterests.value = [...ex.interests]
  generateItinerary()
}

function toggleInterest(tag: VibeTag) {
  if (selectedInterests.value.includes(tag)) {
    selectedInterests.value = selectedInterests.value.filter((t) => t !== tag)
  } else {
    selectedInterests.value = [...selectedInterests.value, tag]
  }
}

function generateItinerary() {
  isGenerating.value = true
  planSavedNotice.value = false

  setTimeout(() => {
    const provinceAttractions = store.attractions.value.filter(
      (a) => a.province === selectedProvince.value,
    )
    const fallbackAttractions =
      provinceAttractions.length > 0
        ? provinceAttractions
        : store.attractions.value

    const days: ItineraryDay[] = []
    let runningCost = 0

    for (let d = 1; d <= daysCount.value; d++) {
      const mainSpot =
        fallbackAttractions[(d - 1) % fallbackAttractions.length]!
      const nearbyRestaurant = mainSpot.nearbyRestaurants[0]
      const morningCost = mainSpot.ticketPriceUsd + 12
      const lunchCost = Math.min(20, Math.max(8, Math.round(budgetUsd.value / (daysCount.value * 5))))
      const eveningCost = Math.min(28, Math.max(10, Math.round(budgetUsd.value / (daysCount.value * 4))))

      runningCost += morningCost + lunchCost + eveningCost

      days.push({
        day: d,
        theme:
          d === 1
            ? `Signature ${selectedProvince.value} Highlights & Local Flavors`
            : d === 2
              ? `Hidden Nature & Authentic Local Experiences`
              : `Slow Morning Cafes & Cultural Exploration`,
        weatherTip: `${mainSpot.weather.tempC}°C · ${mainSpot.weather.condition} — best in ${season.value}`,
        stops: [
          {
            timeOfDay: 'Morning',
            title: `${mainSpot.name} (${mainSpot.bestTime})`,
            type: 'Attraction',
            estimatedCostUsd: morningCost,
            notes: `${mainSpot.highlight} · ${mainSpot.entryFee} + local tuk-tuk transfer.`,
            attractionId: mainSpot.id,
          },
          {
            timeOfDay: 'Afternoon',
            title: nearbyRestaurant
              ? `Lunch at ${nearbyRestaurant.name}`
              : `Local Khmer Lunch in ${selectedProvince.value}`,
            type: 'Dining',
            estimatedCostUsd: lunchCost,
            notes: nearbyRestaurant
              ? `${nearbyRestaurant.cuisineOrStyle} (${nearbyRestaurant.priceRange}) · ${nearbyRestaurant.distanceKm} km away.`
              : 'Sample regional Cambodian dishes and iced palm coffee.',
          },
          {
            timeOfDay: 'Evening',
            title: selectedInterests.value.includes('Nightlife')
              ? `${selectedProvince.value} Night Market & Riverfront Walk`
              : `Sunset Viewpoint & Local Street Food Walk`,
            type: 'Experience',
            estimatedCostUsd: eveningCost,
            notes: `Tailored for ${selectedInterests.value.join(', ') || 'all travelers'} within your $${budgetUsd.value} budget.`,
          },
        ],
      })
    }

    generatedPlan.value = {
      id: `plan-${Date.now()}`,
      title: `${daysCount.value}-Day ${selectedProvince.value} Smart Itinerary`,
      prompt: promptInput.value.trim(),
      province: selectedProvince.value,
      daysCount: daysCount.value,
      budgetUsd: budgetUsd.value,
      estimatedTotalUsd: runningCost,
      season: season.value,
      interests: [...selectedInterests.value],
      createdAt: 'Just generated',
      days,
    }

    isGenerating.value = false
  }, 450)
}

function handleSavePlan() {
  store.saveTripPlan({ ...generatedPlan.value, id: `plan-${Date.now()}` })
  planSavedNotice.value = true
}

const budgetUsagePercent = computed(() => {
  if (!generatedPlan.value.budgetUsd) return 0
  return Math.min(
    100,
    Math.round(
      (generatedPlan.value.estimatedTotalUsd / generatedPlan.value.budgetUsd) *
        100,
    ),
  )
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Hero Prompt Header -->
      <div class="rounded-3xl bg-brand-lime p-6 text-brand-lime-foreground sm:p-10">
        <div class="mx-auto max-w-3xl text-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-black/10 px-3.5 py-1 text-xs font-semibold"
          >
            <Sparkles class="size-3.5" />
            AI Tourism Assistant · Cambodia
          </span>
          <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Tell Us Your Trip Goal, Get a Personalized Itinerary
          </h1>
          <p class="mt-2 text-sm text-brand-lime-foreground/80 sm:text-base">
            Recommendations tailored to your budget, province, favorite categories, ratings, weather, and nearby local experiences.
          </p>

          <!-- Prompt Input -->
          <form
            class="mt-6 flex flex-col gap-2.5 rounded-2xl bg-white p-2.5 text-left shadow-xl sm:flex-row sm:items-center"
            @submit.prevent="generateItinerary"
          >
            <UiInput
              v-model="promptInput"
              type="text"
              placeholder='e.g. "I have 3 days in Siem Reap with a budget of $250. I like nature and local food."'
              class="h-11 flex-1 border-0 bg-transparent px-3 text-sm font-medium text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0"
            />
            <UiButton
              type="submit"
              variant="default"
              size="lg"
              class="shrink-0 rounded-xl font-semibold"
              :disabled="isGenerating"
            >
              <Wand2 class="size-4" />
              {{ isGenerating ? 'Generating...' : 'Generate Plan' }}
            </UiButton>
          </form>

          <!-- Example Chips -->
          <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              v-for="ex in examplePrompts"
              :key="ex.label"
              type="button"
              class="rounded-full bg-black/10 px-3 py-1 text-xs font-medium transition-colors hover:bg-black/20"
              @click="applyExample(ex)"
            >
              {{ ex.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Builder Grid -->
      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left Preferences Panel -->
        <div class="lg:col-span-4">
          <UiCard class="lg:sticky lg:top-24">
            <UiCardHeader>
              <UiCardTitle>Smart Recommendation Inputs</UiCardTitle>
              <UiCardDescription>
                Fine-tune your trip preferences for better AI suggestions
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent class="space-y-4">
              <div class="space-y-1.5">
                <UiLabel>Province in Cambodia</UiLabel>
                <CommonSearchableSelect
                  v-model="selectedProvince"
                  :options="provinceOptions"
                  placeholder="Select a province"
                  search-placeholder="Search province..."
                  aria-label="Select province in Cambodia"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <UiLabel>Days (1–5)</UiLabel>
                  <UiInput
                    v-model.number="daysCount"
                    type="number"
                    min="1"
                    max="5"
                  />
                </div>
                <div class="space-y-1.5">
                  <UiLabel>Budget ($ USD)</UiLabel>
                  <UiInput
                    v-model.number="budgetUsd"
                    type="number"
                    min="50"
                    step="10"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <UiLabel>Travel Season</UiLabel>
                <CommonSearchableSelect
                  v-model="season"
                  :options="seasonOptions"
                  placeholder="Select travel season"
                  search-placeholder="Search season..."
                  aria-label="Select travel season"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-muted-foreground">
                  Favorite Categories &amp; Vibes
                </label>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="tag in VIBE_TAGS"
                    :key="tag"
                    type="button"
                    class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                    :class="
                      selectedInterests.includes(tag)
                        ? 'border-transparent bg-brand-lime text-brand-lime-foreground'
                        : 'border-border bg-muted/40 text-foreground hover:bg-muted'
                    "
                    @click="toggleInterest(tag)"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <UiButton
                variant="brand"
                class="w-full font-semibold"
                :disabled="isGenerating"
                @click="generateItinerary"
              >
                <Sparkles class="size-4" />
                Regenerate Smart Itinerary
              </UiButton>
            </UiCardContent>
          </UiCard>
        </div>

        <!-- Right Generated Itinerary -->
        <div class="space-y-6 lg:col-span-8">
          <!-- Plan Summary Card -->
          <UiCard class="bg-surface-sky/60">
            <UiCardContent class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <UiBadge variant="brand">{{ generatedPlan.province }}</UiBadge>
                  <UiBadge variant="outline">
                    <Calendar class="size-3" />
                    {{ generatedPlan.daysCount }} Days
                  </UiBadge>
                  <UiBadge variant="outline">
                    <CloudSun class="size-3" />
                    {{ generatedPlan.season }}
                  </UiBadge>
                </div>
                <h2 class="mt-2.5 text-xl font-bold tracking-tight sm:text-2xl">
                  {{ generatedPlan.title }}
                </h2>
                <p class="mt-1 text-xs text-muted-foreground">
                  Estimated cost:
                  <span class="font-bold text-foreground">
                    ${{ generatedPlan.estimatedTotalUsd }}
                  </span>
                  of ${{ generatedPlan.budgetUsd }} budget ({{ budgetUsagePercent }}%)
                </p>
                <div class="mt-2 h-2 w-60 max-w-full overflow-hidden rounded-full bg-white">
                  <div
                    class="h-full rounded-full bg-neutral-900 transition-all"
                    :style="{ width: `${budgetUsagePercent}%` }"
                  />
                </div>
              </div>

              <div class="flex flex-col items-start gap-2 sm:items-end">
                <UiButton
                  variant="default"
                  size="sm"
                  class="font-semibold"
                  @click="handleSavePlan"
                >
                  <BookmarkCheck class="size-4" />
                  Save to My Trips
                </UiButton>
                <NuxtLink
                  v-if="planSavedNotice"
                  to="/profile"
                  class="text-xs font-semibold text-emerald-700 underline underline-offset-4"
                >
                  Saved! View in My Profile →
                </NuxtLink>
              </div>
            </UiCardContent>
          </UiCard>

          <!-- Day-by-Day Cards -->
          <div class="space-y-5">
            <UiCard v-for="day in generatedPlan.days" :key="day.day">
              <UiCardHeader>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="flex size-8 items-center justify-center rounded-full bg-brand-lime text-xs font-bold text-brand-lime-foreground"
                    >
                      D{{ day.day }}
                    </span>
                    <UiCardTitle class="text-lg">
                      Day {{ day.day }}: {{ day.theme }}
                    </UiCardTitle>
                  </div>
                  <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CloudSun class="size-3.5 text-amber-500" />
                    {{ day.weatherTip }}
                  </span>
                </div>
              </UiCardHeader>

              <UiCardContent class="space-y-3">
                <div
                  v-for="(stop, idx) in day.stops"
                  :key="idx"
                  class="flex flex-col justify-between gap-3 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center"
                >
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <UiBadge variant="secondary">{{ stop.timeOfDay }}</UiBadge>
                      <span class="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Utensils v-if="stop.type === 'Dining'" class="size-3" />
                        <MapPin v-else class="size-3" />
                        {{ stop.type }}
                      </span>
                    </div>
                    <p class="text-sm font-semibold text-foreground">
                      {{ stop.title }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ stop.notes }}
                    </p>
                  </div>

                  <div class="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span class="inline-flex items-center gap-0.5 text-sm font-bold text-foreground">
                      <DollarSign class="size-3.5" />
                      {{ stop.estimatedCostUsd }}
                    </span>
                    <NuxtLink
                      v-if="stop.attractionId"
                      :to="`/attractions/${stop.attractionId}`"
                      class="text-xs font-semibold text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    >
                      View Spot
                    </NuxtLink>
                  </div>
                </div>
              </UiCardContent>
            </UiCard>
          </div>
        </div>
      </div>
    </main>

    <LayoutAppFooter />
  </div>
</template>
