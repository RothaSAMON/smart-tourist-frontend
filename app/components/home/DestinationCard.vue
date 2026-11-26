<script setup lang="ts">
import { Clock, Heart, Sparkles, Star, Sun } from '@lucide/vue'
import type { DestinationAttraction } from '@/types/tourism'

defineProps<{
  attraction: DestinationAttraction
  isFavorite: boolean
}>()

const emit = defineEmits<{
  toggleFavorite: [id: string]
}>()
</script>

<template>
  <article
    class="group relative h-[320px] overflow-hidden rounded-2xl bg-neutral-900 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-[340px]"
  >
    <NuxtLink
      :to="`/attractions/${attraction.id}`"
      class="block size-full"
    >
      <!-- Full-Bleed Image -->
      <img
        :src="attraction.imageUrl"
        :alt="`${attraction.name} in ${attraction.location}`"
        loading="lazy"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Bottom Gradient Scrim -->
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
      />

      <!-- Top-Left Category Pill -->
      <span
        class="absolute top-3.5 left-3.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md"
      >
        {{ attraction.category }}
      </span>

      <!-- Bottom Content -->
      <div class="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        <h3 class="truncate text-lg font-semibold leading-snug tracking-tight">
          {{ attraction.name }}
        </h3>
        <p class="mt-0.5 text-sm text-white/80">
          {{ attraction.location }}
        </p>

        <!-- Specs Row -->
        <div
          class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/80"
        >
          <span class="inline-flex items-center gap-1">
            <Clock class="size-3.5 text-white/70" />
            {{ attraction.duration }}
          </span>
          <span class="inline-flex items-center gap-1">
            <Sun class="size-3.5 text-white/70" />
            {{ attraction.bestTime }}
          </span>
          <span class="inline-flex items-center gap-1">
            <Sparkles class="size-3.5 text-white/70" />
            {{ attraction.highlight }}
          </span>
        </div>

        <!-- Entry Fee & Rating -->
        <div class="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5">
          <p class="text-base font-bold text-brand-lime">
            {{ attraction.entryFee }}
          </p>

          <span class="inline-flex items-center gap-1 text-xs font-semibold text-white">
            <Star class="size-3.5 fill-amber-400 text-amber-400" />
            {{ attraction.rating.toFixed(1) }}
          </span>
        </div>
      </div>
    </NuxtLink>

    <!-- Top-Right Favorite Toggle -->
    <button
      type="button"
      class="absolute top-3.5 right-3.5 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-md transition-transform hover:scale-105"
      :aria-pressed="isFavorite"
      :aria-label="isFavorite ? `Remove ${attraction.name} from favorites` : `Save ${attraction.name} to favorites`"
      @click.stop="emit('toggleFavorite', attraction.id)"
    >
      <Heart
        class="size-4 transition-colors"
        :class="isFavorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'"
      />
    </button>
  </article>
</template>
