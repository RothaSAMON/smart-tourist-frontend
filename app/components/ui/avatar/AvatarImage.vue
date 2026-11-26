<script setup lang="ts">
import type { AvatarImageProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { AvatarImage } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarImageProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarImage
    data-slot="avatar-image"
    :src="src"
    :class="cn('aspect-square size-full object-cover', props.class)"
  />
</template>
