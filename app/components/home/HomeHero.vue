<script setup lang="ts">
import { HERO_AVATARS, HERO_BACKGROUND_IMAGE } from '@/data/home'
import type { SearchFilters } from '@/types/tourism'

defineProps<{
  searchFilters: SearchFilters
  provinces: string[]
}>()

const emit = defineEmits<{
  search: [filters: SearchFilters]
}>()
</script>

<template>
  <section id="hero" class="pt-4 sm:pt-6">
    <div
      class="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg"
    >
      <!-- Background Image -->
      <img
        :src="HERO_BACKGROUND_IMAGE"
        alt="Iconic Cambodian temple landscape at golden hour"
        class="absolute inset-0 size-full object-cover object-center"
      />
      <!-- Atmospheric Scrim -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/35 to-slate-950/60"
      />

      <!-- Top Overlay Navbar -->
      <LayoutAppNavbar />

      <!-- Centered Hero Content -->
      <div
        class="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-10 pb-16 text-center sm:px-8 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28"
      >
        <!-- Social Proof Pill -->
        <div
          class="mb-5 inline-flex items-center gap-3 rounded-full bg-black/25 px-3.5 py-1.5 backdrop-blur-md"
        >
          <div class="flex -space-x-2">
            <UiAvatar
              v-for="avatar in HERO_AVATARS.slice(0, 2)"
              :key="avatar.name"
              class="size-6 border-2 border-white/90"
            >
              <UiAvatarImage :src="avatar.src" :alt="avatar.name" />
              <UiAvatarFallback>{{ avatar.name.slice(0, 2) }}</UiAvatarFallback>
            </UiAvatar>
          </div>

          <span class="text-xs font-semibold tracking-wide text-brand-lime sm:text-sm">
            124.8K+ Happy Travelers
          </span>

          <div class="flex -space-x-2">
            <UiAvatar
              v-for="avatar in HERO_AVATARS.slice(2, 4)"
              :key="avatar.name"
              class="size-6 border-2 border-white/90"
            >
              <UiAvatarImage :src="avatar.src" :alt="avatar.name" />
              <UiAvatarFallback>{{ avatar.name.slice(0, 2) }}</UiAvatarFallback>
            </UiAvatar>
          </div>
        </div>

        <!-- Headline -->
        <h1
          class="max-w-3xl text-3xl leading-[1.12] font-bold tracking-tight text-white drop-shadow-xs sm:text-5xl lg:text-[3.5rem]"
        >
          Discover Iconic Temples,
          <br class="hidden sm:inline" />
          Explore Hidden Cambodia.
        </h1>

        <p class="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
          Smart tourism recommendations for unforgettable attractions across every province in Cambodia
        </p>

        <!-- Search Bar -->
        <div class="mt-8 w-full sm:mt-10">
          <HomeHeroSearchBar
            :initial-filters="searchFilters"
            :provinces="provinces"
            @search="emit('search', $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
