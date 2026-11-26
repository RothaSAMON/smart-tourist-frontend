<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { AvatarFallback } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    :delay-ms="delayMs"
    :class="cn('bg-muted flex size-full items-center justify-center rounded-full text-xs font-medium', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
