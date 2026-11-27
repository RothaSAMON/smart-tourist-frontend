<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  RefreshCw,
} from '@lucide/vue'
import type { ApiBusiness } from '@/types/business-api'

const route = useRoute()
const { fetchBusinessById } = useBusinessesApi()

const businessId = computed(() => String(route.params.id ?? ''))
const business = ref<ApiBusiness | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

useHead(() => ({
  title: business.value
    ? `${business.value.name} — RokMerl`
    : 'Business Details — RokMerl',
}))

const mapEmbedUrl = computed(() => {
  if (!business.value?.latitude || !business.value?.longitude) {
    return 'https://maps.google.com/maps?q=12.5657,104.9910&z=7&output=embed'
  }
  return `https://maps.google.com/maps?q=${business.value.latitude},${business.value.longitude}&z=15&output=embed`
})

async function loadBusiness(id: string) {
  if (!id) return
  isLoading.value = true
  errorMessage.value = ''
  try {
    business.value = await fetchBusinessById(id)
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    errorMessage.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Unable to load business details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadBusiness(businessId.value)
})

watch(businessId, (nextId) => {
  loadBusiness(nextId)
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main v-if="isLoading" class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      <div class="mt-6 h-52 animate-pulse rounded-3xl bg-muted" />
      <div class="mt-6 h-80 animate-pulse rounded-2xl bg-muted" />
    </main>

    <main
      v-else-if="errorMessage && !business"
      class="mx-auto max-w-xl px-4 py-24 text-center"
    >
      <AlertCircle class="mx-auto size-10 text-destructive" />
      <h1 class="mt-3 text-xl font-bold">Failed to Load Business</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ errorMessage }}</p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <UiButton variant="brand" size="sm" @click="loadBusiness(businessId)">
          <RefreshCw class="size-4" />
          Retry
        </UiButton>
        <NuxtLink to="/business">
          <UiButton variant="outline" size="sm">Back to Businesses</UiButton>
        </NuxtLink>
      </div>
    </main>

    <main
      v-else-if="business"
      class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <NuxtLink
        to="/business"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft class="size-4" />
        Back to Businesses
      </NuxtLink>

      <!-- Business Header Card -->
      <div class="mt-6 rounded-3xl bg-surface-sky p-6 sm:p-8">
        <div class="flex flex-wrap items-center gap-2">
          <UiBadge variant="brand" class="font-semibold">
            <Building2 class="size-3.5" />
            {{ business.category }}
          </UiBadge>
          <UiBadge v-if="business.status" variant="outline" class="capitalize">
            {{ business.status }}
          </UiBadge>
        </div>

        <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {{ business.name }}
        </h1>

        <p
          v-if="business.address"
          class="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <MapPin class="size-4 shrink-0 text-foreground" />
          {{ business.address }}
        </p>

        <!-- Contact Strip -->
        <div class="mt-6 grid grid-cols-1 gap-3 border-t border-border/70 pt-5 sm:grid-cols-2">
          <a
            v-if="business.phone"
            :href="`tel:${business.phone}`"
            class="flex items-center gap-3 rounded-2xl bg-card/90 px-4 py-3 transition-colors hover:bg-card"
          >
            <Phone class="size-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] font-medium text-muted-foreground">Phone</p>
              <p class="truncate text-sm font-semibold text-foreground">
                {{ business.phone }}
              </p>
            </div>
          </a>

          <a
            v-if="business.website"
            :href="business.website"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between gap-3 rounded-2xl bg-card/90 px-4 py-3 transition-colors hover:bg-card"
          >
            <div class="flex min-w-0 items-center gap-3">
              <Globe class="size-4 shrink-0 text-muted-foreground" />
              <div class="min-w-0">
                <p class="text-[11px] font-medium text-muted-foreground">Website</p>
                <p class="truncate text-sm font-semibold text-foreground">
                  {{ business.website }}
                </p>
              </div>
            </div>
            <ExternalLink class="size-4 shrink-0 text-muted-foreground" />
          </a>
        </div>
      </div>

      <!-- Location Map -->
      <UiCard class="mt-6 overflow-hidden p-0">
        <div class="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
          <div class="flex items-center gap-2">
            <MapPin class="size-4 text-foreground" />
            <p class="text-sm font-semibold">Location on Google Maps</p>
          </div>
          <a
            v-if="business.latitude && business.longitude"
            :href="`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4"
          >
            Open in Google Maps
            <ExternalLink class="size-3" />
          </a>
        </div>
        <iframe
          :src="mapEmbedUrl"
          :title="`${business.name} map location`"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="h-[380px] w-full border-0"
        />
      </UiCard>
    </main>

    <main v-else class="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 class="text-2xl font-bold">Business Not Found</h1>
      <NuxtLink to="/business" class="mt-6 inline-block">
        <UiButton variant="brand">Back to Businesses</UiButton>
      </NuxtLink>
    </main>

    <LayoutAppFooter />
  </div>
</template>
