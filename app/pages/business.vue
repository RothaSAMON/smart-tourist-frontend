<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Building2,
  CalendarCheck,
  DollarSign,
  Eye,
  Plus,
  Star,
  TrendingUp,
} from '@lucide/vue'
import { BUSINESS_TYPES, CAMBODIA_PROVINCES } from '@/data/home'
import type { BusinessBooking, BusinessType } from '@/types/tourism'

useHead({
  title: 'Business Owner Portal — SmartTour Cambodia',
})

const store = useTourismStore()
const activeTab = ref<'bookings' | 'services' | 'register'>('bookings')

// Add new service form
const newService = reactive({
  name: '',
  category: 'Restaurant' as BusinessType,
  priceUsd: 25,
  unit: 'per guest',
})

// Register business form
const bizForm = reactive({
  name: 'Angkor Palm Heritage House',
  type: 'Homestay' as BusinessType,
  province: 'Siem Reap',
  description:
    'Family-run Khmer wooden homestay with organic garden breakfast and private Angkor tuk-tuk tours.',
  photoUrl:
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
})
const bizSavedNotice = ref(false)

const totalRevenue = computed(() =>
  store.businessBookings.value
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalUsd, 0),
)

const pendingCount = computed(
  () =>
    store.businessBookings.value.filter((b) => b.status === 'pending').length,
)

function updateBookingStatus(
  id: string,
  status: BusinessBooking['status'],
) {
  store.businessBookings.value = store.businessBookings.value.map((b) =>
    b.id === id ? { ...b, status } : b,
  )
}

function addService() {
  if (!newService.name.trim()) return
  store.businessServices.value = [
    {
      id: `srv-${Date.now()}`,
      name: newService.name.trim(),
      category: newService.category,
      priceUsd: Number(newService.priceUsd) || 10,
      unit: newService.unit.trim() || 'per booking',
      available: true,
    },
    ...store.businessServices.value,
  ]
  newService.name = ''
  newService.priceUsd = 25
}

function updatePrice(id: string, delta: number) {
  store.businessServices.value = store.businessServices.value.map((s) =>
    s.id === id ? { ...s, priceUsd: Math.max(1, s.priceUsd + delta) } : s,
  )
}

function submitBusinessProfile() {
  bizSavedNotice.value = true
  setTimeout(() => {
    bizSavedNotice.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 rounded-3xl bg-surface-sky p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <UiBadge variant="brand" class="mb-2 font-semibold">
            Business Owner Portal
          </UiBadge>
          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Your Cambodian Tourism Business
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            For Restaurants, Hotels, Coffee Shops, Homestays, Tour Guides, and Transportation providers.
          </p>
        </div>

        <UiButton variant="brand" class="shrink-0 font-semibold" @click="activeTab = 'register'">
          <Building2 class="size-4" />
          Register / Edit Business
        </UiButton>
      </div>

      <!-- Visitor Statistics KPIs -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Monthly Profile Views</p>
              <p class="mt-1 text-2xl font-bold">4,820</p>
              <p class="mt-0.5 text-xs text-emerald-600">+18% vs last month</p>
            </div>
            <span class="flex size-10 items-center justify-center rounded-xl bg-surface-sky">
              <Eye class="size-5 text-foreground" />
            </span>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Confirmed Revenue</p>
              <p class="mt-1 text-2xl font-bold">${{ totalRevenue }}</p>
              <p class="mt-0.5 text-xs text-muted-foreground">This cycle</p>
            </div>
            <span class="flex size-10 items-center justify-center rounded-xl bg-brand-lime">
              <DollarSign class="size-5 text-brand-lime-foreground" />
            </span>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Pending Bookings</p>
              <p class="mt-1 text-2xl font-bold">{{ pendingCount }}</p>
              <p class="mt-0.5 text-xs text-amber-600">Action needed</p>
            </div>
            <span class="flex size-10 items-center justify-center rounded-xl bg-amber-100">
              <CalendarCheck class="size-5 text-amber-700" />
            </span>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Average Guest Rating</p>
              <p class="mt-1 text-2xl font-bold">4.85</p>
              <p class="mt-0.5 text-xs text-muted-foreground">Based on 126 reviews</p>
            </div>
            <span class="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Star class="size-5 fill-amber-400 text-amber-400" />
            </span>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- Tabs -->
      <div class="mt-8 flex flex-wrap gap-2">
        <UiButton
          size="sm"
          :variant="activeTab === 'bookings' ? 'brand' : 'outline'"
          @click="activeTab = 'bookings'"
        >
          Manage Bookings ({{ store.businessBookings.value.length }})
        </UiButton>
        <UiButton
          size="sm"
          :variant="activeTab === 'services' ? 'brand' : 'outline'"
          @click="activeTab = 'services'"
        >
          Services &amp; Pricing ({{ store.businessServices.value.length }})
        </UiButton>
        <UiButton
          size="sm"
          :variant="activeTab === 'register' ? 'brand' : 'outline'"
          @click="activeTab = 'register'"
        >
          Business Profile &amp; Photos
        </UiButton>
      </div>

      <!-- Tab 1: Bookings -->
      <UiCard v-if="activeTab === 'bookings'" class="mt-6">
        <UiCardHeader>
          <UiCardTitle>Incoming Tourist Bookings</UiCardTitle>
          <UiCardDescription>
            Confirm or decline reservations in real time
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-3">
          <div
            v-for="bk in store.businessBookings.value"
            :key="bk.id"
            class="flex flex-col justify-between gap-3 rounded-2xl border border-border/80 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold">{{ bk.guestName }}</p>
                <UiBadge
                  :variant="
                    bk.status === 'confirmed'
                      ? 'brand'
                      : bk.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                  "
                >
                  {{ bk.status }}
                </UiBadge>
              </div>
              <p class="mt-0.5 text-xs text-muted-foreground">
                {{ bk.serviceName }} · {{ bk.date }} · {{ bk.guests }} guests
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="mr-2 text-sm font-bold">${{ bk.totalUsd }}</span>
              <UiButton
                v-if="bk.status === 'pending'"
                variant="brand"
                size="sm"
                @click="updateBookingStatus(bk.id, 'confirmed')"
              >
                Confirm
              </UiButton>
              <UiButton
                v-if="bk.status === 'pending'"
                variant="outline"
                size="sm"
                @click="updateBookingStatus(bk.id, 'cancelled')"
              >
                Decline
              </UiButton>
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Tab 2: Services & Pricing -->
      <div v-else-if="activeTab === 'services'" class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <UiCard class="lg:col-span-5">
          <UiCardHeader>
            <UiCardTitle>Add New Service</UiCardTitle>
            <UiCardDescription>
              List a room, menu package, tour, or transport option
            </UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <form class="space-y-3.5" @submit.prevent="addService">
              <div>
                <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                  Service Name
                </label>
                <UiInput v-model="newService.name" required placeholder="e.g. Kampot Sunset Boat Tour" />
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                  Business Category
                </label>
                <select
                  v-model="newService.category"
                  class="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none"
                >
                  <option v-for="t in BUSINESS_TYPES" :key="t" :value="t">
                    {{ t }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                    Price ($ USD)
                  </label>
                  <UiInput v-model.number="newService.priceUsd" type="number" min="1" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                    Unit
                  </label>
                  <UiInput v-model="newService.unit" placeholder="per guest / night" />
                </div>
              </div>

              <UiButton type="submit" variant="brand" class="w-full font-semibold">
                <Plus class="size-4" />
                Add Service
              </UiButton>
            </form>
          </UiCardContent>
        </UiCard>

        <UiCard class="lg:col-span-7">
          <UiCardHeader>
            <UiCardTitle>Active Services &amp; Quick Price Update</UiCardTitle>
          </UiCardHeader>
          <UiCardContent class="space-y-3">
            <div
              v-for="srv in store.businessServices.value"
              :key="srv.id"
              class="flex flex-col justify-between gap-3 rounded-2xl border border-border/80 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <UiBadge variant="secondary" class="mb-1">{{ srv.category }}</UiBadge>
                <p class="text-sm font-semibold">{{ srv.name }}</p>
                <p class="text-xs text-muted-foreground">{{ srv.unit }}</p>
              </div>
              <div class="flex items-center gap-2">
                <UiButton variant="outline" size="icon" @click="updatePrice(srv.id, -5)">
                  -
                </UiButton>
                <span class="min-w-16 text-center text-sm font-bold">
                  ${{ srv.priceUsd }}
                </span>
                <UiButton variant="outline" size="icon" @click="updatePrice(srv.id, 5)">
                  +
                </UiButton>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- Tab 3: Business Registration & Photos -->
      <UiCard v-else class="mt-6">
        <UiCardHeader>
          <UiCardTitle>Business Registration &amp; Photo Gallery</UiCardTitle>
          <UiCardDescription>
            Keep your listing accurate for AI Trip Planner recommendations
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <form class="grid grid-cols-1 gap-6 lg:grid-cols-12" @submit.prevent="submitBusinessProfile">
            <div class="space-y-4 lg:col-span-7">
              <div>
                <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                  Business Name
                </label>
                <UiInput v-model="bizForm.name" required />
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                    Business Type
                  </label>
                  <select
                    v-model="bizForm.type"
                    class="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none"
                  >
                    <option v-for="t in BUSINESS_TYPES" :key="t" :value="t">
                      {{ t }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                    Province
                  </label>
                  <select
                    v-model="bizForm.province"
                    class="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none"
                  >
                    <option v-for="p in CAMBODIA_PROVINCES" :key="p" :value="p">
                      {{ p }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                  Description
                </label>
                <UiTextarea v-model="bizForm.description" />
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-muted-foreground">
                  Cover Photo URL
                </label>
                <UiInput v-model="bizForm.photoUrl" />
              </div>

              <div class="flex items-center gap-3">
                <UiButton type="submit" variant="brand" class="font-semibold">
                  Save Business Profile
                </UiButton>
                <span v-if="bizSavedNotice" class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <TrendingUp class="size-3.5" />
                  Profile updated!
                </span>
              </div>
            </div>

            <div class="lg:col-span-5">
              <p class="mb-2 text-xs font-semibold text-muted-foreground">Live Card Preview</p>
              <div class="overflow-hidden rounded-2xl border border-border">
                <img
                  :src="bizForm.photoUrl"
                  :alt="bizForm.name"
                  class="h-48 w-full object-cover"
                />
                <div class="p-4">
                  <div class="flex items-center gap-2">
                    <UiBadge variant="brand">{{ bizForm.type }}</UiBadge>
                    <span class="text-xs text-muted-foreground">{{ bizForm.province }}, Cambodia</span>
                  </div>
                  <p class="mt-2 font-bold">{{ bizForm.name }}</p>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ bizForm.description }}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </UiCardContent>
      </UiCard>
    </main>

    <LayoutAppFooter />
  </div>
</template>
