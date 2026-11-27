<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Landmark, MapPin, Search } from '@lucide/vue'
import type { SearchFilters } from '@/types/tourism'

const props = defineProps<{
  initialFilters: SearchFilters
  provinces: string[]
}>()

const emit = defineEmits<{
  search: [filters: SearchFilters]
}>()

const form = reactive<SearchFilters>({
  province: props.initialFilters.province,
  attraction: props.initialFilters.attraction,
})

watch(
  () => props.initialFilters,
  (next) => {
    form.province = next.province
    form.attraction = next.attraction
  },
  { deep: true },
)

const selectedProvinceModel = computed({
  get: () => form.province || 'all',
  set: (value: string) => {
    form.province = value === 'all' ? '' : value
  },
})

const provinceOptions = computed(() => [
  { label: 'All Provinces', value: 'all' },
  ...props.provinces.map((p) => ({ label: p, value: p })),
])

function handleSubmit() {
  emit('search', { ...form })
}
</script>

<template>
  <form
    class="mx-auto w-full max-w-2xl rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 sm:rounded-full sm:p-2.5"
    @submit.prevent="handleSubmit"
  >
    <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_1.2fr_auto] sm:gap-0">
      <!-- Province (shadcn-vue Combobox) -->
      <div class="flex items-center gap-3 rounded-xl px-4 py-1.5 text-left transition-colors hover:bg-neutral-50 sm:rounded-full">
        <MapPin class="size-4 shrink-0 text-neutral-500" />
        <div class="min-w-0 flex-1">
          <span class="block text-[11px] font-medium text-neutral-400">Province</span>
          <CommonSearchableSelect
            v-model="selectedProvinceModel"
            :options="provinceOptions"
            placeholder="All Provinces"
            search-placeholder="Search province..."
            empty-text="No province found."
            aria-label="Filter by province in Cambodia"
            trigger-class="h-7 border-0 bg-transparent px-0 py-0 text-xs font-semibold text-neutral-900 shadow-none focus-visible:ring-0 sm:text-sm"
          />
        </div>
      </div>

      <!-- Attraction (shadcn-vue Input) -->
      <label class="flex items-center gap-3 rounded-xl border-t border-neutral-100 px-4 py-1.5 text-left transition-colors hover:bg-neutral-50 sm:rounded-full sm:border-t-0 sm:border-l sm:border-neutral-200/80">
        <Landmark class="size-4 shrink-0 text-neutral-500" />
        <span class="min-w-0 flex-1">
          <span class="block text-[11px] font-medium text-neutral-400">Attraction</span>
          <UiInput
            v-model="form.attraction"
            type="text"
            placeholder="e.g. Angkor Wat, Koh Rong..."
            class="h-7 border-0 bg-transparent px-0 py-0 text-xs font-semibold text-neutral-900 shadow-none placeholder:text-neutral-500 focus-visible:ring-0 sm:text-sm"
          />
        </span>
      </label>

      <!-- Submit -->
      <div class="pt-1 sm:pt-0 sm:pl-2">
        <UiButton
          type="submit"
          variant="brand"
          size="lg"
          class="w-full rounded-xl px-6 font-semibold sm:w-auto sm:rounded-full"
        >
          <Search class="size-4" />
          Search
        </UiButton>
      </div>
    </div>
  </form>
</template>
