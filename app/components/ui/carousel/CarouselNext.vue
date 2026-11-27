<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ArrowRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { useCarousel } from './useCarousel'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { canScrollNext, scrollNext } = useCarousel()
</script>

<template>
  <UiButton
    data-slot="carousel-next"
    variant="outline"
    size="icon"
    :disabled="!canScrollNext"
    aria-label="Next slide"
    :class="
      cn(
        'absolute top-1/2 right-4 z-10 size-9 -translate-y-1/2 rounded-full border-white/30 bg-white/90 text-neutral-900 shadow-md backdrop-blur-xs hover:bg-white',
        props.class,
      )
    "
    @click="scrollNext"
  >
    <ArrowRight class="size-4" />
  </UiButton>
</template>
