<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Check, Clock, Heart, Sparkles, Star, Sun } from '@lucide/vue'
import type { DestinationAttraction } from '@/types/tourism'

const props = defineProps<{
  attractions: DestinationAttraction[]
  isLoading: boolean
  isFavorite: (id: string) => boolean
}>()

const emit = defineEmits<{
  toggleFavorite: [id: string]
}>()

const activeIndex = ref(0)

watch(
  () => props.attractions.length,
  (len) => {
    if (activeIndex.value >= len) {
      activeIndex.value = 0
    }
  },
)

const activeItem = computed(() => {
  return props.attractions[activeIndex.value] ?? props.attractions[0] ?? null
})
</script>

<template>
  <section id="awards" class="py-6 sm:py-10">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="h-[440px] w-full animate-pulse rounded-3xl bg-muted"
    />

    <!-- Live Top-Rated Showcase -->
    <div
      v-else-if="activeItem"
      class="relative overflow-hidden rounded-3xl bg-slate-900 shadow-lg"
    >
      <!-- Dynamic Background Image -->
      <img
        :src="activeItem.imageUrl"
        :alt="`${activeItem.name} panoramic view in ${activeItem.location}`"
        loading="lazy"
        class="absolute inset-0 size-full object-cover transition-all duration-500"
      />
      <!-- Scrim -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-slate-900/30"
      />

      <!-- Content Grid -->
      <div
        class="relative z-10 grid min-h-[440px] grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:p-14"
      >
        <!-- Left Copy + Circular Thumbnails -->
        <div class="flex h-full flex-col justify-between gap-8 lg:col-span-6">
          <div>
            <h2
              class="max-w-md text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              Globally Acclaimed Heritage &amp; Award-Winning Destinations in Cambodia.
            </h2>
            <p class="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              RokMerl spotlights Cambodia's highest-rated landmarks, UNESCO treasures, and natural escapes.
            </p>
          </div>

          <!-- Circular Thumbnail Selector -->
          <div
            class="flex flex-wrap items-center gap-3"
            role="tablist"
            aria-label="Select featured Cambodian attraction"
          >
            <button
              v-for="(item, index) in attractions"
              :key="item.id"
              type="button"
              role="tab"
              :aria-selected="index === activeIndex"
              :aria-label="`View ${item.name}`"
              class="relative size-14 rounded-full p-0.5 transition-transform hover:scale-105 sm:size-16"
              :class="
                index === activeIndex
                  ? 'ring-2 ring-brand-lime ring-offset-2 ring-offset-slate-900/60'
                  : 'ring-2 ring-white/50 opacity-85 hover:opacity-100'
              "
              @click="activeIndex = index"
            >
              <img
                :src="item.imageUrl"
                :alt="item.name"
                loading="lazy"
                class="size-full rounded-full object-cover"
              />
              <span
                v-if="index === activeIndex"
                class="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-brand-lime text-brand-lime-foreground shadow-sm"
              >
                <Check class="size-3 stroke-[3]" />
              </span>
            </button>
          </div>
        </div>

        <!-- Right Floating Spotlight Card -->
        <div class="flex justify-center lg:col-span-6 lg:justify-end">
          <div
            class="w-full max-w-md rounded-2xl bg-card p-3.5 text-card-foreground shadow-2xl sm:p-4"
          >
            <div class="flex flex-col gap-4 sm:flex-row">
              <!-- Card Thumbnail -->
              <div class="h-44 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-36">
                <img
                  :src="activeItem.imageUrl"
                  :alt="activeItem.name"
                  class="size-full object-cover"
                />
              </div>

              <!-- Card Details -->
              <div class="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <h3 class="text-sm font-bold leading-snug text-foreground sm:text-base">
                        {{ activeItem.name }} - {{ activeItem.province }}
                      </h3>
                    </div>
                    <button
                      type="button"
                      class="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
                      :aria-label="`Favorite ${activeItem.name}`"
                      @click="emit('toggleFavorite', activeItem.id)"
                    >
                      <Heart
                        class="size-4"
                        :class="isFavorite(activeItem.id) ? 'fill-rose-500 text-rose-500' : ''"
                      />
                    </button>
                  </div>

                  <!-- Compact Specs -->
                  <div
                    class="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground"
                  >
                    <span class="inline-flex items-center gap-1">
                      <Clock class="size-3" />
                      {{ activeItem.openingHours }}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <Sun class="size-3" />
                      {{ activeItem.bestTime }}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <Sparkles class="size-3" />
                      {{ activeItem.category }}
                    </span>
                  </div>
                </div>

                <!-- Entry Fee + Rating + CTA -->
                <div class="mt-4">
                  <div class="flex items-center justify-between">
                    <p class="text-base font-bold text-foreground">
                      {{ activeItem.entryFee }}
                    </p>
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                      <Star class="size-3.5 fill-amber-400 text-amber-400" />
                      {{ activeItem.rating.toFixed(1) }}
                    </span>
                  </div>

                  <NuxtLink :to="`/attractions/${activeItem.id}`" class="mt-3 block">
                    <UiButton
                      variant="brand"
                      size="sm"
                      class="w-full font-semibold"
                    >
                      Explore Now
                    </UiButton>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
