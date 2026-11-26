<script setup lang="ts">
import { Compass } from '@lucide/vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-border/70 py-10">
    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8"
    >
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <span
          class="flex size-8 items-center justify-center rounded-lg bg-brand-lime text-brand-lime-foreground"
        >
          <Compass class="size-4" />
        </span>
        <span class="text-base font-semibold tracking-tight text-foreground">
          SmartTour Cambodia
        </span>
      </NuxtLink>

      <p class="text-center text-xs text-muted-foreground sm:text-left">
        Smart Tourism Recommendations Platform &copy; {{ currentYear }}. All rights reserved.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-muted-foreground">
        <NuxtLink to="/explore" class="transition-colors hover:text-foreground">
          Explore
        </NuxtLink>
        <NuxtLink to="/planner" class="transition-colors hover:text-foreground">
          AI Trip Planner
        </NuxtLink>
        <NuxtLink to="/profile" class="transition-colors hover:text-foreground">
          Tourist Profile
        </NuxtLink>
        <NuxtLink to="/business" class="transition-colors hover:text-foreground">
          Business Portal
        </NuxtLink>
        <NuxtLink to="/admin" class="transition-colors hover:text-foreground">
          Admin
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
