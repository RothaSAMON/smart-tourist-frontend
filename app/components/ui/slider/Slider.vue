<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  SliderRootProps & { class?: HTMLAttributes['class'] }
>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SliderRoot
    data-slot="slider"
    v-bind="forwarded"
    :class="
      cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <SliderTrack
      data-slot="slider-track"
      class="bg-muted relative h-2 w-full grow overflow-hidden rounded-full"
    >
      <SliderRange
        data-slot="slider-range"
        class="bg-neutral-900 absolute h-full"
      />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      data-slot="slider-thumb"
      class="border-neutral-900 bg-brand-lime focus-visible:ring-ring/50 block size-4 shrink-0 rounded-full border-2 shadow-sm transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none"
    />
  </SliderRoot>
</template>
