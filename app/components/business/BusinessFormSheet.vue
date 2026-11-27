<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { AlertCircle, Loader2 } from '@lucide/vue'
import { BUSINESS_TYPES } from '@/data/home'
import type { ApiBusiness, BusinessMutationPayload } from '@/types/business-api'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  editingBusiness: ApiBusiness | null
  defaultUserId?: number | string
  isSubmitting: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  submit: [payload: BusinessMutationPayload]
}>()

const isEditMode = computed(() => Boolean(props.editingBusiness))

const categoryOptions = BUSINESS_TYPES.map((type) => ({
  label: type,
  value: type,
}))

const form = reactive({
  user_id: '1',
  category: 'Hotel',
  name: '',
  address: '',
  latitude: '13.3632533',
  longitude: '103.856403',
  phone: '',
  website: '',
})

watch(
  () => [open.value, props.editingBusiness] as const,
  ([isOpen, item]) => {
    if (!isOpen) return

    if (item) {
      form.user_id = String(item.user_id ?? props.defaultUserId ?? 1)
      form.category = item.category || 'Hotel'
      form.name = item.name || ''
      form.address = item.address || ''
      form.latitude = String(item.latitude ?? '')
      form.longitude = String(item.longitude ?? '')
      form.phone = item.phone || ''
      form.website = item.website || ''
    } else {
      form.user_id = String(props.defaultUserId ?? 1)
      form.category = 'Hotel'
      form.name = ''
      form.address = ''
      form.latitude = '13.3632533'
      form.longitude = '103.856403'
      form.phone = ''
      form.website = ''
    }
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit', {
    user_id: form.user_id,
    category: form.category,
    name: form.name,
    address: form.address,
    latitude: form.latitude,
    longitude: form.longitude,
    phone: form.phone,
    website: form.website,
  })
}
</script>

<template>
  <UiSheet v-model:open="open">
    <UiSheetContent side="right" class="w-full max-w-lg sm:max-w-lg">
      <UiSheetHeader class="border-b border-border/70 pb-4">
        <UiSheetTitle>
          {{ isEditMode ? 'Update Business' : 'Register New Business' }}
        </UiSheetTitle>
        <UiSheetDescription>
          {{
            isEditMode
              ? `Editing business #${editingBusiness?.id} via PUT /businesses/${editingBusiness?.id}`
              : 'Create a new Cambodia tourism business via POST /businesses'
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
              <UiLabel>Category</UiLabel>
              <CommonSearchableSelect
                v-model="form.category"
                :options="categoryOptions"
                placeholder="Select category"
                search-placeholder="Search category..."
                aria-label="Select business category"
              />
            </div>

            <div class="space-y-1.5">
              <UiLabel for="biz-user-id">Owner User ID</UiLabel>
              <UiInput
                id="biz-user-id"
                v-model="form.user_id"
                type="number"
                min="1"
                required
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <UiLabel for="biz-form-name">Business Name</UiLabel>
            <UiInput
              id="biz-form-name"
              v-model="form.name"
              required
              placeholder="e.g. Angkor Riverside Boutique"
            />
          </div>

          <div class="space-y-1.5">
            <UiLabel for="biz-form-address">Address</UiLabel>
            <UiInput
              id="biz-form-address"
              v-model="form.address"
              required
              placeholder="Charles de Gaulle Blvd, Krong Siem Reap, Cambodia"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <UiLabel for="biz-form-lat">Latitude</UiLabel>
              <UiInput
                id="biz-form-lat"
                v-model="form.latitude"
                type="number"
                step="any"
                required
              />
            </div>
            <div class="space-y-1.5">
              <UiLabel for="biz-form-lng">Longitude</UiLabel>
              <UiInput
                id="biz-form-lng"
                v-model="form.longitude"
                type="number"
                step="any"
                required
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <UiLabel for="biz-form-phone">Phone Number</UiLabel>
            <UiInput
              id="biz-form-phone"
              v-model="form.phone"
              type="tel"
              required
              placeholder="+855 63 965 222"
            />
          </div>

          <div class="space-y-1.5">
            <UiLabel for="biz-form-website">Website</UiLabel>
            <UiInput
              id="biz-form-website"
              v-model="form.website"
              type="url"
              placeholder="https://angkorriverside.example.kh"
            />
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
                  : 'Create Business'
            }}
          </UiButton>
        </UiSheetFooter>
      </form>
    </UiSheetContent>
  </UiSheet>
</template>
