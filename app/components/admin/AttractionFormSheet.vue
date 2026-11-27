<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { AlertCircle, ImagePlus, Loader2 } from '@lucide/vue'
import type {
  ApiAttraction,
  AttractionMutationPayload,
} from '@/types/attraction-api'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  editingAttraction: ApiAttraction | null
  provinceOptions: { label: string; value: string }[]
  categoryOptions: { label: string; value: string }[]
  isSubmitting: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  submit: [payload: AttractionMutationPayload]
}>()

const isEditMode = computed(() => Boolean(props.editingAttraction))

const form = reactive({
  province_id: '1',
  category_id: '1',
  name: '',
  description: '',
  latitude: '13.4347222',
  longitude: '103.8891667',
  address: '',
  opening_hour: '07:30',
  closing_hour: '17:30',
  entrance_fee: '0',
  average_rating: '4.8',
})

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')

function normalizeHour(hour: string | null | undefined, fallback: string) {
  if (!hour) return fallback
  // Convert "05:00:00" -> "05:00" for time input & API format
  return hour.slice(0, 5)
}

watch(
  () => [open.value, props.editingAttraction] as const,
  ([isOpen, item]) => {
    if (!isOpen) return
    selectedFile.value = null

    if (item) {
      form.province_id = String(item.province_id)
      form.category_id = String(item.category_id)
      form.name = item.name || ''
      form.description = item.description || ''
      form.latitude = String(item.latitude ?? '')
      form.longitude = String(item.longitude ?? '')
      form.address = item.address || ''
      form.opening_hour = normalizeHour(item.opening_hour, '07:30')
      form.closing_hour = normalizeHour(item.closing_hour, '17:30')
      form.entrance_fee = String(item.entrance_fee ?? 0)
      form.average_rating = String(item.average_rating ?? 4.5)
      previewUrl.value = item.image_url || item.image || ''
    } else {
      form.province_id = props.provinceOptions[0]?.value || '1'
      form.category_id = props.categoryOptions[0]?.value || '1'
      form.name = ''
      form.description = ''
      form.latitude = '13.4347222'
      form.longitude = '103.8891667'
      form.address = ''
      form.opening_hour = '07:30'
      form.closing_hour = '17:30'
      form.entrance_fee = '0'
      form.average_rating = '4.8'
      previewUrl.value = ''
    }
  },
  { immediate: true },
)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  selectedFile.value = file
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}

function handleSubmit() {
  emit('submit', {
    province_id: form.province_id,
    category_id: form.category_id,
    name: form.name,
    description: form.description,
    latitude: form.latitude,
    longitude: form.longitude,
    address: form.address,
    opening_hour: form.opening_hour,
    closing_hour: form.closing_hour,
    entrance_fee: form.entrance_fee,
    average_rating: form.average_rating,
    image: selectedFile.value,
  })
}
</script>

<template>
  <UiSheet v-model:open="open">
    <UiSheetContent side="right" class="w-full max-w-lg sm:max-w-lg">
      <UiSheetHeader class="border-b border-border/70 pb-4">
        <UiSheetTitle>
          {{ isEditMode ? 'Update Attraction' : 'Create New Attraction' }}
        </UiSheetTitle>
        <UiSheetDescription>
          {{
            isEditMode
              ? `Editing attraction #${editingAttraction?.id} via PUT /attractions/${editingAttraction?.id}`
              : 'Submit a new Cambodia attraction via POST /attractions'
          }}
        </UiSheetDescription>
      </UiSheetHeader>

      <form
        class="flex flex-1 flex-col overflow-hidden"
        @submit.prevent="handleSubmit"
      >
        <div class="flex-1 space-y-4 overflow-y-auto px-5 py-3">
          <div
            v-if="errorMessage"
            role="alert"
            class="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs font-medium text-destructive"
          >
            <AlertCircle class="mt-0.5 size-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <UiLabel>Province</UiLabel>
              <CommonSearchableSelect
                v-model="form.province_id"
                :options="provinceOptions"
                placeholder="Select province"
                search-placeholder="Search province..."
                aria-label="Select province"
              />
            </div>

            <div class="space-y-1.5">
              <UiLabel>Category</UiLabel>
              <CommonSearchableSelect
                v-model="form.category_id"
                :options="categoryOptions"
                placeholder="Select category"
                search-placeholder="Search category..."
                aria-label="Select category"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <UiLabel for="attr-name">Attraction Name</UiLabel>
            <UiInput
              id="attr-name"
              v-model="form.name"
              required
              placeholder="e.g. Ta Prohm Temple"
            />
          </div>

          <div class="space-y-1.5">
            <UiLabel for="attr-desc">Description</UiLabel>
            <UiTextarea
              id="attr-desc"
              v-model="form.description"
              required
              placeholder="Famous jungle temple entwined with giant silk-cotton tree roots."
            />
          </div>

          <div class="space-y-1.5">
            <UiLabel for="attr-address">Address</UiLabel>
            <UiInput
              id="attr-address"
              v-model="form.address"
              required
              placeholder="Angkor Archaeological Park, Siem Reap, Cambodia"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <UiLabel for="attr-lat">Latitude</UiLabel>
              <UiInput
                id="attr-lat"
                v-model="form.latitude"
                type="number"
                step="any"
                required
              />
            </div>
            <div class="space-y-1.5">
              <UiLabel for="attr-lng">Longitude</UiLabel>
              <UiInput
                id="attr-lng"
                v-model="form.longitude"
                type="number"
                step="any"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <UiLabel for="attr-open">Opening Hour</UiLabel>
              <UiInput
                id="attr-open"
                v-model="form.opening_hour"
                type="time"
                required
              />
            </div>
            <div class="space-y-1.5">
              <UiLabel for="attr-close">Closing Hour</UiLabel>
              <UiInput
                id="attr-close"
                v-model="form.closing_hour"
                type="time"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <UiLabel for="attr-fee">Entrance Fee ($ USD)</UiLabel>
              <UiInput
                id="attr-fee"
                v-model="form.entrance_fee"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div class="space-y-1.5">
              <UiLabel for="attr-rating">Average Rating (0–5)</UiLabel>
              <UiInput
                id="attr-rating"
                v-model="form.average_rating"
                type="number"
                min="0"
                max="5"
                step="0.01"
                required
              />
            </div>
          </div>

          <!-- Image File Upload -->
          <div class="space-y-1.5">
            <UiLabel for="attr-image">Attraction Image (File)</UiLabel>
            <label
              for="attr-image"
              class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center transition-colors hover:bg-muted/60"
            >
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="Attraction preview"
                class="h-32 w-full rounded-lg object-cover"
              />
              <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ImagePlus class="size-4" />
                <span>
                  {{
                    selectedFile
                      ? selectedFile.name
                      : 'Click to upload image file (PNG, JPG, WebP)'
                  }}
                </span>
              </div>
              <input
                id="attr-image"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handleFileChange"
              />
            </label>
          </div>
        </div>

        <UiSheetFooter class="flex-row justify-end gap-2">
          <UiButton
            type="button"
            variant="outline"
            :disabled="isSubmitting"
            @click="open = false"
          >
            Cancel
          </UiButton>
          <UiButton
            type="submit"
            variant="brand"
            class="font-semibold"
            :disabled="isSubmitting"
          >
            <Loader2 v-if="isSubmitting" class="size-4 animate-spin" />
            {{
              isSubmitting
                ? 'Saving...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Create Attraction'
            }}
          </UiButton>
        </UiSheetFooter>
      </form>
    </UiSheetContent>
  </UiSheet>
</template>
