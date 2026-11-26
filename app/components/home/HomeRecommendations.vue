<script setup lang="ts">
import { computed } from 'vue'
import { DESTINATION_CATEGORIES } from '@/data/home'
import type {
  DestinationAttraction,
  DestinationCategory,
  SearchFilters,
} from '@/types/tourism'

const props = defineProps<{
  attractions: DestinationAttraction[]
  activeCategory: DestinationCategory
  searchFilters: SearchFilters
  isFavorite: (id: string) => boolean
}>()

const emit = defineEmits<{
  selectCategory: [category: DestinationCategory]
  resetFilters: []
  toggleFavorite: [id: string]
}>()

const activeSearchLabel = computed(() => {
  const parts: string[] = []
  if (props.searchFilters.province.trim()) {
    parts.push(`Province: ${props.searchFilters.province.trim()}`)
  }
  if (props.searchFilters.attraction.trim()) {
    parts.push(`Attraction: "${props.searchFilters.attraction.trim()}"`)
  }
  return parts.join(' · ')
})
</script>

<template>
  <section id="recommendations" class="py-14 sm:py-20">
    <!-- Section Heading -->
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Where Heritage Meets Paradise
      </h2>
      <p class="mt-3 text-sm text-muted-foreground sm:text-base">
        Discover handpicked attractions across Cambodia — from ancient Angkor temples to tropical islands.
      </p>
    </div>

    <!-- Filter Bar -->
    <div
      class="mt-8 flex flex-wrap items-center justify-between gap-4 sm:mt-10"
    >
      <div
        class="flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter Cambodian attractions by category"
      >
        <UiButton
          v-for="category in DESTINATION_CATEGORIES"
          :key="category"
          role="tab"
          :aria-selected="activeCategory === category"
          :variant="activeCategory === category ? 'brand' : 'outline'"
          size="sm"
          class="px-5 font-medium"
          @click="emit('selectCategory', category)"
        >
          {{ category }}
        </UiButton>
      </div>

      <NuxtLink
        to="/explore"
        class="text-sm font-semibold text-foreground transition-colors hover:text-neutral-600"
      >
        See All
      </NuxtLink>
    </div>

    <!-- Active Search Notice -->
    <div
      v-if="activeSearchLabel"
      class="mt-4 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-2.5 text-sm"
    >
      <p class="text-muted-foreground">
        Showing recommendations for
        <span class="font-semibold text-foreground">{{ activeSearchLabel }}</span>
      </p>
      <button
        type="button"
        class="text-xs font-semibold text-foreground underline underline-offset-4"
        @click="emit('resetFilters')"
      >
        Clear search
      </button>
    </div>

    <!-- Card Grid -->
    <div
      v-if="attractions.length > 0"
      class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <HomeDestinationCard
        v-for="attraction in attractions"
        :key="attraction.id"
        :attraction="attraction"
        :is-favorite="isFavorite(attraction.id)"
        @toggle-favorite="emit('toggleFavorite', $event)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center"
    >
      <p class="text-base font-semibold text-foreground">
        No matching attractions found in Cambodia
      </p>
      <p class="mt-1 text-sm text-muted-foreground">
        Try another attraction name like "Angkor Wat" or reset to all provinces.
      </p>
      <UiButton variant="brand" size="sm" class="mt-5" @click="emit('resetFilters')">
        Reset Filters
      </UiButton>
    </div>
  </section>
</template>
