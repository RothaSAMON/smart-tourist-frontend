<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useProvideCarousel } from './useCarousel'

const props = withDefaults(
  defineProps<{
    loop?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    loop: true,
  },
)

const carousel = useProvideCarousel({ loop: props.loop })

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    carousel.scrollPrev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    carousel.scrollNext()
  }
}

defineExpose(carousel)
</script>

<template>
  <div
    data-slot="carousel"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    :class="cn('relative outline-none', props.class)"
    @keydown="onKeyDown"
  >
    <slot
      :current-index="carousel.currentIndex.value"
      :slide-count="carousel.slideCount.value"
      :scroll-to="carousel.scrollTo"
      :scroll-prev="carousel.scrollPrev"
      :scroll-next="carousel.scrollNext"
    />
  </div>
</template>
