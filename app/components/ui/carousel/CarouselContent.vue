<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useCarousel } from './useCarousel'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { viewportRef } = useCarousel()
</script>

<template>
  <div
    ref="viewportRef"
    data-slot="carousel-content"
    class="overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <div :class="cn('flex', props.class)" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>
