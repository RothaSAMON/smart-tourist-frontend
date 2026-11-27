<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  Clock,
  CloudSun,
  Droplets,
  Heart,
  Hotel,
  MapPin,
  Play,
  Sparkles,
  Star,
  Ticket,
  Utensils,
} from '@lucide/vue'

const route = useRoute()
const store = useTourismStore()

const attraction = computed(() =>
  store.getAttractionById(String(route.params.id ?? '')),
)

useHead(() => ({
  title: attraction.value
    ? `${attraction.value.name} (${attraction.value.province}) — RokMerl`
    : 'Attraction Not Found — RokMerl',
}))

const showVideo = ref(false)
const nearbyTab = ref<'restaurants' | 'hotels'>('restaurants')

// Review form state
const reviewRating = ref(5)
const reviewComment = ref('')
const reviewPhotoUrl = ref('')
const reviewSubmitted = ref(false)

const attractionReviews = computed(() =>
  attraction.value ? store.getReviewsForAttraction(attraction.value.id) : [],
)

const galleryImages = computed(() => {
  if (!attraction.value) return []
  return attraction.value.gallery.length > 0
    ? attraction.value.gallery
    : [attraction.value.imageUrl]
})

function submitReview() {
  if (!attraction.value || !reviewComment.value.trim()) return
  store.addReview({
    attractionId: attraction.value.id,
    rating: reviewRating.value,
    comment: reviewComment.value.trim(),
    photoUrl: reviewPhotoUrl.value.trim() || undefined,
  })
  reviewComment.value = ''
  reviewPhotoUrl.value = ''
  reviewRating.value = 5
  reviewSubmitted.value = true
  setTimeout(() => {
    reviewSubmitted.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main v-if="attraction" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Breadcrumb & Actions -->
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <NuxtLink
          to="/explore"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft class="size-4" />
          Back to Explore
        </NuxtLink>

        <div class="flex flex-wrap items-center gap-2.5">
          <UiButton
            variant="outline"
            size="sm"
            @click="store.toggleFavorite(attraction.id)"
          >
            <Heart
              class="size-4"
              :class="
                store.isFavorite(attraction.id)
                  ? 'fill-rose-500 text-rose-500'
                  : ''
              "
            />
            {{ store.isFavorite(attraction.id) ? 'Saved' : 'Save Favorite' }}
          </UiButton>

          <NuxtLink :to="`/planner?province=${encodeURIComponent(attraction.province)}`">
            <UiButton variant="brand" size="sm" class="font-semibold">
              <Sparkles class="size-4" />
              Plan Trip in {{ attraction.province }}
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Title Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge variant="brand">{{ attraction.category }}</UiBadge>
            <UiBadge
              v-for="tag in attraction.tags"
              :key="tag"
              variant="secondary"
            >
              {{ tag }}
            </UiBadge>
          </div>
          <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {{ attraction.name }}
          </h1>
          <p class="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin class="size-4 text-foreground" />
            {{ attraction.location }} · {{ attraction.distanceFromCenterKm }} km from center
          </p>
        </div>

        <div class="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-2.5">
          <Star class="size-5 fill-amber-400 text-amber-400" />
          <span class="text-lg font-bold">{{ attraction.rating.toFixed(1) }}</span>
          <span class="text-xs text-muted-foreground">
            ({{ attraction.reviewCount.toLocaleString() }} reviews)
          </span>
        </div>
      </div>

      <!-- Media Gallery (shadcn-vue Carousel) + Video Preview -->
      <div class="mt-6">
        <div
          v-if="showVideo"
          class="relative overflow-hidden rounded-3xl bg-neutral-900"
        >
          <iframe
            :src="attraction.videoPreviewUrl"
            :title="`${attraction.name} video tour`"
            class="h-[340px] w-full border-0 sm:h-[480px]"
            allowfullscreen
          />
          <UiButton
            variant="outline"
            size="sm"
            class="absolute right-4 bottom-4 rounded-full bg-white/95 text-xs font-semibold text-neutral-900 shadow-lg hover:bg-white"
            @click="showVideo = false"
          >
            Back to Photo Carousel
          </UiButton>
        </div>

        <UiCarousel v-else v-slot="{ currentIndex, scrollTo }" :loop="true">
          <div class="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-sm">
            <UiCarouselContent>
              <UiCarouselItem
                v-for="(img, idx) in galleryImages"
                :key="`${img}-${idx}`"
              >
                <img
                  :src="img"
                  :alt="`${attraction.name} photo ${idx + 1}`"
                  class="h-[340px] w-full object-cover sm:h-[480px]"
                />
              </UiCarouselItem>
            </UiCarouselContent>

            <UiCarouselPrevious v-if="galleryImages.length > 1" />
            <UiCarouselNext v-if="galleryImages.length > 1" />

            <!-- Slide Counter Pill -->
            <span
              v-if="galleryImages.length > 1"
              class="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
            >
              {{ currentIndex + 1 }} / {{ galleryImages.length }}
            </span>

            <!-- Video Preview Toggle -->
            <button
              type="button"
              class="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-neutral-900 shadow-lg transition-transform hover:scale-105"
              @click="showVideo = true"
            >
              <Play class="size-3.5 fill-neutral-900" />
              Watch Video Preview
            </button>
          </div>

          <!-- Synced Thumbnail Strip -->
          <div
            v-if="galleryImages.length > 1"
            class="mt-3 flex flex-wrap items-center gap-2.5"
          >
            <button
              v-for="(img, idx) in galleryImages"
              :key="`thumb-${idx}`"
              type="button"
              class="overflow-hidden rounded-xl border-2 transition-all"
              :class="
                currentIndex === idx
                  ? 'border-brand-lime ring-2 ring-brand-lime/60'
                  : 'border-transparent opacity-70 hover:opacity-100'
              "
              @click="scrollTo(idx)"
            >
              <img
                :src="img"
                :alt="`${attraction.name} thumbnail ${idx + 1}`"
                class="h-16 w-24 object-cover sm:h-20 sm:w-28"
              />
            </button>
          </div>
        </UiCarousel>
      </div>

      <!-- Main Details & Sidebar -->
      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left Column: Description, History, Nearby, Reviews -->
        <div class="space-y-8 lg:col-span-8">
          <!-- Overview & History -->
          <UiCard>
            <UiCardHeader>
              <UiCardTitle class="text-xl">About {{ attraction.name }}</UiCardTitle>
            </UiCardHeader>
            <UiCardContent class="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p class="text-foreground/90">{{ attraction.description }}</p>
              <UiSeparator />
              <div>
                <h4 class="mb-1.5 text-base font-semibold text-foreground">
                  History &amp; Cultural Significance
                </h4>
                <p>{{ attraction.history }}</p>
              </div>
            </UiCardContent>
          </UiCard>

          <!-- Nearby Restaurants & Hotels -->
          <UiCard>
            <UiCardHeader>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <UiCardTitle class="text-xl">Nearby Local Experiences</UiCardTitle>
                  <UiCardDescription>
                    Curated Cambodian restaurants and stays close to {{ attraction.name }}
                  </UiCardDescription>
                </div>
                <UiTabs v-model="nearbyTab">
                  <UiTabsList>
                    <UiTabsTrigger value="restaurants">
                      <Utensils class="size-3.5" />
                      Restaurants ({{ attraction.nearbyRestaurants.length }})
                    </UiTabsTrigger>
                    <UiTabsTrigger value="hotels">
                      <Hotel class="size-3.5" />
                      Hotels ({{ attraction.nearbyHotels.length }})
                    </UiTabsTrigger>
                  </UiTabsList>
                </UiTabs>
              </div>
            </UiCardHeader>
            <UiCardContent>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  v-for="place in nearbyTab === 'restaurants'
                    ? attraction.nearbyRestaurants
                    : attraction.nearbyHotels"
                  :key="place.id"
                  class="flex gap-3.5 rounded-2xl border border-border/80 p-3 transition-colors hover:bg-muted/30"
                >
                  <img
                    :src="place.imageUrl"
                    :alt="place.name"
                    class="size-20 shrink-0 rounded-xl object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-foreground">
                      {{ place.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ place.cuisineOrStyle }}
                    </p>
                    <div class="mt-2 flex items-center justify-between text-xs">
                      <span class="font-semibold text-foreground">{{ place.priceRange }}</span>
                      <span class="inline-flex items-center gap-1 text-muted-foreground">
                        <Star class="size-3 fill-amber-400 text-amber-400" />
                        {{ place.rating.toFixed(1) }} · {{ place.distanceKm }} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </UiCardContent>
          </UiCard>

          <!-- Tourist Reviews & Photo Upload -->
          <UiCard>
            <UiCardHeader>
              <UiCardTitle class="text-xl">
                Traveler Reviews &amp; Photos ({{ attractionReviews.length }})
              </UiCardTitle>
              <UiCardDescription>
                Share your experience and upload a travel photo to help fellow visitors
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent class="space-y-6">
              <!-- Write a Review Form -->
              <form
                class="space-y-3 rounded-2xl bg-surface-sky/70 p-4"
                @submit.prevent="submitReview"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="text-sm font-semibold">Write a Review</p>
                  <div class="flex items-center gap-1">
                    <button
                      v-for="n in 5"
                      :key="n"
                      type="button"
                      :aria-label="`Rate ${n} stars`"
                      @click="reviewRating = n"
                    >
                      <Star
                        class="size-5 transition-colors"
                        :class="
                          n <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300'
                        "
                      />
                    </button>
                  </div>
                </div>

                <UiTextarea
                  v-model="reviewComment"
                  placeholder="Share tips on timing, tickets, food, or what you loved most..."
                  class="bg-white"
                />

                <div class="flex flex-col gap-2 sm:flex-row">
                  <UiInput
                    v-model="reviewPhotoUrl"
                    placeholder="Optional travel photo URL (https://...)"
                    class="bg-white"
                  />
                  <UiButton type="submit" variant="brand" class="shrink-0 font-semibold">
                    Post Review
                  </UiButton>
                </div>

                <p v-if="reviewSubmitted" class="text-xs font-semibold text-emerald-700">
                  Review published! Thank you for contributing to RokMerl.
                </p>
              </form>

              <!-- Review List -->
              <div class="space-y-4">
                <div
                  v-for="rev in attractionReviews"
                  :key="rev.id"
                  class="rounded-2xl border border-border/70 p-4"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <UiAvatar class="size-9">
                        <UiAvatarImage :src="rev.avatarUrl" :alt="rev.author" />
                        <UiAvatarFallback>{{ rev.author.slice(0, 2) }}</UiAvatarFallback>
                      </UiAvatar>
                      <div>
                        <p class="text-sm font-semibold">{{ rev.author }}</p>
                        <p class="text-xs text-muted-foreground">{{ rev.date }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-0.5">
                      <Star
                        v-for="n in rev.rating"
                        :key="n"
                        class="size-3.5 fill-amber-400 text-amber-400"
                      />
                    </div>
                  </div>
                  <p class="mt-3 text-sm text-foreground/90">{{ rev.comment }}</p>
                  <img
                    v-if="rev.photoUrl"
                    :src="rev.photoUrl"
                    alt="Traveler uploaded photo"
                    class="mt-3 h-40 w-64 rounded-xl object-cover"
                  />
                </div>
              </div>
            </UiCardContent>
          </UiCard>
        </div>

        <!-- Right Sidebar: Practical Info, Weather & Interactive Map -->
        <div class="space-y-6 lg:col-span-4">
          <!-- Essential Info Card -->
          <UiCard>
            <UiCardHeader>
              <UiCardTitle>Visitor Information</UiCardTitle>
            </UiCardHeader>
            <UiCardContent class="space-y-3.5 text-sm">
              <div class="flex items-start gap-3">
                <Ticket class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p class="text-xs text-muted-foreground">Ticket Price</p>
                  <p class="font-semibold text-foreground">{{ attraction.entryFee }}</p>
                </div>
              </div>
              <UiSeparator />
              <div class="flex items-start gap-3">
                <Clock class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p class="text-xs text-muted-foreground">Opening Hours</p>
                  <p class="font-semibold text-foreground">{{ attraction.openingHours }}</p>
                </div>
              </div>
              <UiSeparator />
              <div class="flex items-start gap-3">
                <Sparkles class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p class="text-xs text-muted-foreground">Suggested Duration &amp; Best Time</p>
                  <p class="font-semibold text-foreground">
                    {{ attraction.duration }} · {{ attraction.bestTime }}
                  </p>
                </div>
              </div>
            </UiCardContent>
          </UiCard>

          <!-- Weather Card -->
          <div class="rounded-2xl bg-surface-sky p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-muted-foreground">Current Weather</p>
                <p class="mt-1 text-3xl font-bold text-foreground">
                  {{ attraction.weather.tempC }}°C
                </p>
                <p class="text-sm font-medium text-foreground">
                  {{ attraction.weather.condition }}
                </p>
              </div>
              <CloudSun class="size-12 text-amber-500" />
            </div>
            <div class="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs text-muted-foreground">
              <span class="inline-flex items-center gap-1">
                <Droplets class="size-3.5" />
                Humidity: {{ attraction.weather.humidity }}%
              </span>
              <span>Best: {{ attraction.weather.bestSeason }}</span>
            </div>
          </div>

          <!-- Location Map -->
          <ExploreInteractiveMapPanel
            :attractions="[attraction]"
            :selected-id="attraction.id"
          />
        </div>
      </div>
    </main>

    <!-- Not Found -->
    <main v-else class="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 class="text-2xl font-bold">Attraction Not Found</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        The destination you are looking for does not exist in our Cambodia catalog yet.
      </p>
      <NuxtLink to="/explore" class="mt-6 inline-block">
        <UiButton variant="brand">Browse All Attractions</UiButton>
      </NuxtLink>
    </main>

    <LayoutAppFooter />
  </div>
</template>
