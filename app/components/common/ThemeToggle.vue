<script setup lang="ts">
import { Check, Monitor, Moon, Sun } from '@lucide/vue'
import type { ThemePreference } from '@/composables/useTheme'

const props = withDefaults(
  defineProps<{
    variant?: 'transparent' | 'solid'
    mode?: 'dropdown' | 'segmented'
  }>(),
  {
    variant: 'solid',
    mode: 'dropdown',
  },
)

const { preference, setTheme } = useTheme()

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]
</script>

<template>
  <!-- Segmented mode (for mobile sidebar) -->
  <div
    v-if="props.mode === 'segmented'"
    class="grid grid-cols-3 gap-1 rounded-xl bg-muted/70 p-1"
    role="radiogroup"
    aria-label="Select theme mode"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="preference === opt.value"
      class="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all"
      :class="
        preference === opt.value
          ? 'bg-brand-lime text-brand-lime-foreground shadow-2xs'
          : 'text-muted-foreground hover:text-foreground'
      "
      @click="setTheme(opt.value)"
    >
      <component :is="opt.icon" class="size-3.5" />
      <span>{{ opt.label }}</span>
    </button>
  </div>

  <!-- Dropdown mode (for navbar) -->
  <UiDropdownMenu v-else>
    <UiDropdownMenuTrigger as-child>
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-full border transition-colors"
        :class="
          props.variant === 'solid'
            ? 'border-border bg-background text-foreground hover:bg-muted'
            : 'border-white/25 bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
        "
        aria-label="Toggle color theme"
      >
        <Sun v-if="preference === 'light'" class="size-4" />
        <Moon v-else-if="preference === 'dark'" class="size-4" />
        <Monitor v-else class="size-4" />
      </button>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent>
      <UiDropdownMenuItem
        v-for="opt in options"
        :key="opt.value"
        @select="setTheme(opt.value)"
      >
        <component :is="opt.icon" class="size-3.5" />
        <span class="flex-1">{{ opt.label }}</span>
        <Check v-if="preference === opt.value" class="size-3.5 text-foreground" />
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
