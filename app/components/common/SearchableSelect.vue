<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronsUpDown } from '@lucide/vue'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  label: string
  value: string
}

const modelValue = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    options: ComboboxOption[]
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    ariaLabel?: string
    triggerClass?: string
  }>(),
  {
    placeholder: 'Select option...',
    searchPlaceholder: 'Search...',
    emptyText: 'No match found.',
    ariaLabel: 'Select option',
    triggerClass: '',
  },
)

const open = ref(false)
const searchTerm = ref('')

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === modelValue.value),
)

const filteredOptions = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((opt) => opt.label.toLowerCase().includes(q))
})

function handleSelect(val: string) {
  modelValue.value = val
  searchTerm.value = ''
  open.value = false
}
</script>

<template>
  <UiCombobox
    v-model:open="open"
    :model-value="modelValue"
    :ignore-filter="true"
    @update:model-value="(val) => typeof val === 'string' && handleSelect(val)"
  >
    <UiComboboxAnchor>
      <UiComboboxTrigger as-child>
        <button
          type="button"
          :aria-label="ariaLabel"
          :class="
            cn(
              'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/40 flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium whitespace-nowrap shadow-2xs transition-colors outline-none focus-visible:ring-2',
              triggerClass,
            )
          "
        >
          <span
            class="truncate"
            :class="!selectedOption ? 'text-muted-foreground' : ''"
          >
            {{ selectedOption?.label ?? placeholder }}
          </span>
          <ChevronsUpDown class="size-3.5 shrink-0 opacity-60" />
        </button>
      </UiComboboxTrigger>
    </UiComboboxAnchor>

    <UiComboboxList>
      <UiComboboxInput
        v-model="searchTerm"
        :placeholder="searchPlaceholder"
        auto-focus
      />
      <UiComboboxEmpty v-if="filteredOptions.length === 0">
        {{ emptyText }}
      </UiComboboxEmpty>
      <UiComboboxGroup v-else>
        <UiComboboxItem
          v-for="option in filteredOptions"
          :key="option.value"
          :value="option.value"
        >
          <span class="truncate">{{ option.label }}</span>
          <UiComboboxItemIndicator>
            <Check class="size-4" />
          </UiComboboxItemIndicator>
        </UiComboboxItem>
      </UiComboboxGroup>
    </UiComboboxList>
  </UiCombobox>
</template>
