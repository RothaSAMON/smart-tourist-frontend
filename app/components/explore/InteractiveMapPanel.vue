<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink, MapPin, Star } from '@lucide/vue'
import type { DestinationAttraction } from '@/types/tourism'

const props = defineProps<{
  attractions: DestinationAttraction[]
  selectedId?: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const activeAttraction = computed(() => {
  if (props.selectedId) {
    const found = props.attractions.find((a) => a.id === props.selectedId)
    if (found) return found
  }
  return props.attractions[0]
})

const mapEmbedUrl = computed(() => {
  const item = activeAttraction.value
  if (!item) {
    return 'https://maps.google.com/maps?q=12.5657,104.9910&z=7&output=embed'
  }
  const { lat, lng } = item.coordinates
  return `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`
})
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
    <!-- Map Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="flex size-7 items-center justify-center rounded-lg bg-brand-lime text-brand-lime-foreground">
          <MapPin class="size-4" />
        </span>
        <div>
          <p class="text-xs font-semibold text-foreground">
            Interactive Cambodia Map
          </p>
          <p class="text-[11px] text-muted-foreground">
            Google Maps preview · Ready for Google Maps JS API
          </p>
        </div>
      </div>

      <a
        v-if="activeAttraction"
        :href="`https://www.google.com/maps/search/?api=1&query=${activeAttraction.coordinates.lat},${activeAttraction.coordinates.lng}`"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
      >
        Open in Google Maps
        <ExternalLink class="size-3" />
      </a>
    </div>

    <!-- Map Frame -->
    <div class="relative h-[340px] w-full bg-surface-sky sm:h-[420px]">
      <iframe
        :src="mapEmbedUrl"
        title="Cambodia Destination Map"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="size-full border-0"
      />
    </div>

    <!-- Quick Pin Switcher & Selected Preview -->
    <div v-if="attractions.length > 1" class="border-t border-border/70 bg-muted/30 p-3">
      <p class="mb-2 text-[11px] font-medium text-muted-foreground">
        Select a destination pin ({{ attractions.length }})
      </p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="item in attractions"
          :key="item.id"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
          :class="
            activeAttraction?.id === item.id
              ? 'border-transparent bg-brand-lime text-brand-lime-foreground'
              : 'border-border bg-card text-card-foreground hover:bg-muted'
          "
          @click="emit('select', item.id)"
        >
          <MapPin class="size-3" />
          {{ item.name }}
        </button>
      </div>
    </div>

    <div
      v-if="activeAttraction"
      class="flex items-center justify-between gap-3 border-t border-border/70 bg-card px-4 py-3"
    >
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-foreground">
          {{ activeAttraction.name }}
        </p>
        <p class="text-xs text-muted-foreground">
          {{ activeAttraction.province }} · {{ activeAttraction.entryFee }} ·
          <span class="inline-flex items-center gap-0.5 font-medium text-foreground">
            <Star class="size-3 fill-amber-400 text-amber-400" />
            {{ activeAttraction.rating.toFixed(1) }}
          </span>
        </p>
      </div>
      <NuxtLink :to="`/attractions/${activeAttraction.id}`">
        <UiButton variant="brand" size="sm" class="font-semibold">
          View Details
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>
