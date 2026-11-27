<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ArrowLeft } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { useCarousel } from './useCarousel'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { canScrollPrev, scrollPrev } = useCarousel()
</script>

<template>
  <UiButton
    data-slot="carousel-previous"
    variant="outline"
    size="icon"
    :disabled="!canScrollPrev"
    aria-label="Previous slide"
    :class="
      cn(
        'absolute top-1/2 left-4 z-10 size-9 -translate-y-1/2 rounded-full border-white/30 bg-white/90 text-neutral-900 shadow-md backdrop-blur-xs hover:bg-white',
        props.class,
      )
    "
    @click="scrollPrev"
  >
    <ArrowLeft class="size-4" />
  </UiButton>
</template>
