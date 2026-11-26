<script setup lang="ts">
import { Star } from '@lucide/vue'
import { FEATURE_COLLAGE_IMAGES, HERO_AVATARS, UNIQUE_FEATURES } from '@/data/home'
</script>

<template>
  <section id="unique" class="py-6 sm:py-10">
    <div
      class="rounded-3xl bg-surface-sky px-6 py-12 sm:px-10 sm:py-16 lg:px-14"
    >
      <!-- Centered Section Header -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What Makes SmartTour Unique
        </h2>
        <p class="mt-3 text-sm text-muted-foreground sm:text-base">
          SmartTour believes every journey starts with the right destination — offering comfort, connection, and a place to truly belong.
        </p>
      </div>

      <!-- Two-Column Content -->
      <div
        class="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10"
      >
        <!-- Left Feature List -->
        <div class="lg:col-span-5">
          <div
            v-for="(feature, index) in UNIQUE_FEATURES"
            :key="feature.id"
          >
            <div class="py-5 first:pt-0 last:pb-0">
              <h3 class="text-lg font-semibold tracking-tight text-foreground">
                {{ feature.title }}
              </h3>
              <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {{ feature.description }}
              </p>
            </div>
            <UiSeparator
              v-if="index < UNIQUE_FEATURES.length - 1"
              class="bg-slate-200/80"
            />
          </div>
        </div>

        <!-- Right Layered Photo Collage -->
        <div class="relative mx-auto w-full max-w-md lg:col-span-7 lg:max-w-none lg:pl-14">
          <div class="relative ml-auto w-[84%] sm:w-[78%]">
            <!-- Main Vertical Scenic Photo -->
            <div class="overflow-hidden rounded-3xl shadow-xl">
              <img
                :src="FEATURE_COLLAGE_IMAGES.mainCity"
                alt="Historic European waterfront skyline"
                loading="lazy"
                class="aspect-[4/5] w-full object-cover"
              />
            </div>

            <!-- Floating Top-Right Rating Pill -->
            <div
              class="absolute -top-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-foreground shadow-lg sm:right-6 sm:text-sm"
            >
              <Star class="size-4 fill-neutral-900 text-neutral-900" />
              <span>4.8 Avg Rating</span>
            </div>

            <!-- Overlapping Mid-Left Framed Secondary Image -->
            <div
              class="absolute top-[22%] -left-[22%] w-[58%] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl sm:-left-[26%] sm:w-[56%]"
            >
              <img
                :src="FEATURE_COLLAGE_IMAGES.insetTower"
                alt="Modern luxury hotel tower against clear sky"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover"
              />
            </div>

            <!-- Floating Bottom-Left Travelers Pill -->
            <div
              class="absolute bottom-8 -left-[14%] flex items-center gap-2.5 rounded-full bg-white py-2 pr-4 pl-2.5 shadow-xl sm:-left-[16%]"
            >
              <div class="flex -space-x-2">
                <UiAvatar
                  v-for="avatar in HERO_AVATARS.slice(0, 3)"
                  :key="avatar.name"
                  class="size-7 border-2 border-white"
                >
                  <UiAvatarImage :src="avatar.src" :alt="avatar.name" />
                  <UiAvatarFallback>{{ avatar.name.slice(0, 2) }}</UiAvatarFallback>
                </UiAvatar>
              </div>
              <span class="text-xs font-semibold text-foreground sm:text-sm">
                102K+ Trips Planned
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
