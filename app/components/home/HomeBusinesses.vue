<script setup lang="ts">
import { computed } from 'vue'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  RefreshCw,
} from '@lucide/vue'
import type { ApiBusiness } from '@/types/business-api'

const props = defineProps<{
  businesses: ApiBusiness[]
  isLoading: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const visibleBusinesses = computed(() => props.businesses.slice(0, 6))
</script>

<template>
  <section id="businesses" class="py-10 sm:py-16">
    <!-- Section Header -->
    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <UiBadge variant="brand" class="mb-2.5 font-semibold">
          <Building2 class="size-3.5" />
          Local Partners
        </UiBadge>
        <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Trusted Local Businesses &amp; Services
        </h2>
        <p class="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Hotels, Khmer restaurants, coffee shops, homestays, tour guides, and transport across Cambodia.
        </p>
      </div>

      <NuxtLink
        to="/business"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
      >
        View All Businesses
        <ArrowRight class="size-4" />
      </NuxtLink>
    </div>

    <!-- Error State -->
    <div
      v-if="errorMessage"
      class="mt-7 flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-10 text-center"
    >
      <AlertCircle class="size-7 text-destructive" />
      <p class="mt-2.5 text-sm font-semibold text-destructive">
        {{ errorMessage }}
      </p>
      <UiButton variant="brand" size="sm" class="mt-4" @click="emit('retry')">
        <RefreshCw class="size-3.5" />
        Retry
      </UiButton>
    </div>

    <!-- Loading Skeleton -->
    <div
      v-else-if="isLoading"
      class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="h-48 animate-pulse rounded-2xl bg-muted"
      />
    </div>

    <!-- Businesses Grid -->
    <div
      v-else-if="visibleBusinesses.length > 0"
      class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <UiCard
        v-for="biz in visibleBusinesses"
        :key="biz.id"
        class="justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <UiCardHeader>
          <div class="flex items-center justify-between gap-2">
            <UiBadge variant="brand" class="font-semibold">
              {{ biz.category }}
            </UiBadge>
            <UiBadge v-if="biz.status" variant="outline" class="capitalize">
              {{ biz.status }}
            </UiBadge>
          </div>
          <UiCardTitle class="mt-2 text-lg">
            {{ biz.name }}
          </UiCardTitle>
          <UiCardDescription
            v-if="biz.address"
            class="flex items-start gap-1.5 text-xs"
          >
            <MapPin class="mt-0.5 size-3.5 shrink-0" />
            <span>{{ biz.address }}</span>
          </UiCardDescription>
        </UiCardHeader>

        <UiCardContent class="space-y-2 text-xs text-muted-foreground">
          <p v-if="biz.phone" class="flex items-center gap-1.5">
            <Phone class="size-3.5 shrink-0" />
            <span>{{ biz.phone }}</span>
          </p>
          <a
            v-if="biz.website"
            :href="biz.website"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            <Globe class="size-3.5 shrink-0" />
            <span class="truncate">Visit Website</span>
            <ExternalLink class="size-3 shrink-0" />
          </a>
        </UiCardContent>

        <UiCardFooter class="justify-end border-t border-border/60 pt-3">
          <NuxtLink :to="`/businesses/${biz.id}`" class="w-full">
            <UiButton variant="outline" size="sm" class="w-full font-semibold">
              Explore Business
            </UiButton>
          </NuxtLink>
        </UiCardFooter>
      </UiCard>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="mt-7 rounded-2xl border border-dashed border-border py-12 text-center"
    >
      <p class="text-sm font-semibold text-foreground">
        No local businesses published yet
      </p>
      <NuxtLink to="/business" class="mt-3 inline-block">
        <UiButton variant="brand" size="sm">Register a Business</UiButton>
      </NuxtLink>
    </div>
  </section>
</template>
