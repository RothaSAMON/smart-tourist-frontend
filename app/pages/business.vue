<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  AlertCircle,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from '@lucide/vue'
import { BUSINESS_TYPES } from '@/data/home'
import type { ApiPaginationMeta } from '@/types/attraction-api'
import type { ApiBusiness, BusinessMutationPayload } from '@/types/business-api'
import type { BusinessBooking, BusinessType } from '@/types/tourism'

useHead({
  title: 'Business Owner Portal — RokMerl',
})

const store = useTourismStore()
const { user: authUser } = useAuth()
const {
  fetchBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = useBusinessesApi()

const activeTab = ref<'listings' | 'bookings' | 'services'>('listings')

// Live Businesses CRUD state
const apiBusinesses = ref<ApiBusiness[]>([])
const paginationMeta = ref<ApiPaginationMeta | null>(null)
const currentPage = ref(1)
const isLoadingBusinesses = ref(true)
const businessesError = ref('')
const searchQuery = ref('')
const categoryFilter = ref('all')

const formSheetOpen = ref(false)
const editingBusiness = ref<ApiBusiness | null>(null)
const isSavingBusiness = ref(false)
const formError = ref('')
const actionBanner = ref('')

const deletingTarget = ref<ApiBusiness | null>(null)
const deleteDialogOpen = ref(false)
const isDeletingBusiness = ref(false)

const businessTypeOptions = BUSINESS_TYPES.map((t) => ({ label: t, value: t }))
const filterCategoryOptions = computed(() => {
  const unique = Array.from(
    new Set([
      ...BUSINESS_TYPES,
      ...(Array.isArray(apiBusinesses.value)
        ? apiBusinesses.value.map((b) => b.category).filter(Boolean)
        : []),
    ]),
  )
  return [
    { label: 'All Categories', value: 'all' },
    ...unique.map((c) => ({ label: c, value: c })),
  ]
})

async function loadBusinesses(page = currentPage.value) {
  isLoadingBusinesses.value = true
  businessesError.value = ''
  try {
    const res = await fetchBusinesses(page)
    apiBusinesses.value = Array.isArray(res?.items) ? res.items : []
    paginationMeta.value = res?.meta ?? null
    currentPage.value = res?.meta?.current_page ?? page
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    businessesError.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Unable to fetch businesses from API.'
  } finally {
    isLoadingBusinesses.value = false
  }
}

onMounted(() => {
  loadBusinesses(1)
})

const filteredBusinesses = computed(() => {
  const list = Array.isArray(apiBusinesses.value) ? apiBusinesses.value : []
  const q = searchQuery.value.trim().toLowerCase()
  return list.filter((b) => {
    const matchesCat =
      categoryFilter.value === 'all' ||
      b.category?.toLowerCase() === categoryFilter.value.toLowerCase()
    const matchesQuery =
      !q ||
      b.name.toLowerCase().includes(q) ||
      (b.address ?? '').toLowerCase().includes(q) ||
      (b.category ?? '').toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })
})

function openCreateForm() {
  editingBusiness.value = null
  formError.value = ''
  formSheetOpen.value = true
}

function openEditForm(item: ApiBusiness) {
  editingBusiness.value = item
  formError.value = ''
  formSheetOpen.value = true
}

function openDeleteDialog(item: ApiBusiness) {
  deletingTarget.value = item
  deleteDialogOpen.value = true
}

async function handleSaveBusiness(payload: BusinessMutationPayload) {
  if (isSavingBusiness.value) return
  isSavingBusiness.value = true
  formError.value = ''
  try {
    if (editingBusiness.value) {
      await updateBusiness(editingBusiness.value.id, payload)
      actionBanner.value = `Updated "${payload.name}" successfully.`
    } else {
      await createBusiness(payload)
      actionBanner.value = `Created "${payload.name}" successfully.`
    }
    formSheetOpen.value = false
    await loadBusinesses(currentPage.value)
    setTimeout(() => {
      actionBanner.value = ''
    }, 3500)
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    formError.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Failed to save business. Make sure you are logged in.'
  } finally {
    isSavingBusiness.value = false
  }
}

async function handleConfirmDelete() {
  if (!deletingTarget.value || isDeletingBusiness.value) return
  isDeletingBusiness.value = true
  try {
    const targetName = deletingTarget.value.name
    await deleteBusiness(deletingTarget.value.id)
    deleteDialogOpen.value = false
    deletingTarget.value = null
    actionBanner.value = `Deleted "${targetName}" successfully.`
    await loadBusinesses(currentPage.value)
    setTimeout(() => {
      actionBanner.value = ''
    }, 3500)
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    businessesError.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Failed to delete business.'
  } finally {
    isDeletingBusiness.value = false
  }
}

// Local mock services & bookings (ready for future APIs)
const newService = reactive({
  name: '',
  category: 'Restaurant' as BusinessType,
  priceUsd: 25,
  unit: 'per guest',
})

const totalRevenue = computed(() =>
  store.businessBookings.value
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalUsd, 0),
)

const pendingCount = computed(
  () =>
    store.businessBookings.value.filter((b) => b.status === 'pending').length,
)

function updateBookingStatus(id: string, status: BusinessBooking['status']) {
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
            Cambodia Tourism Businesses
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Manage Restaurants, Hotels, Coffee Shops, Homestays, Tour Guides, and Transportation via /businesses API.
          </p>
        </div>

        <UiButton variant="brand" class="shrink-0 font-semibold" @click="openCreateForm">
          <Plus class="size-4" />
          Register Business
        </UiButton>
      </div>

      <!-- KPIs -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Total Businesses</p>
              <p class="mt-1 text-2xl font-bold">
                {{ paginationMeta?.total ?? apiBusinesses.length }}
              </p>
              <p class="mt-0.5 text-xs text-muted-foreground">Live from /businesses</p>
            </div>
            <span class="flex size-10 items-center justify-center rounded-xl bg-surface-sky">
              <Building2 class="size-5 text-foreground" />
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
            <span class="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60">
              <CalendarCheck class="size-5 text-amber-700 dark:text-amber-400" />
            </span>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Monthly Views</p>
              <p class="mt-1 text-2xl font-bold">4,820</p>
              <p class="mt-0.5 text-xs text-emerald-600">+18% vs last month</p>
            </div>
            <span class="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Eye class="size-5 text-foreground" />
            </span>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- shadcn-vue Tabs -->
      <UiTabs v-model="activeTab" class="mt-8">
        <UiTabsList>
          <UiTabsTrigger value="listings">
            Businesses Directory ({{ paginationMeta?.total ?? apiBusinesses.length }})
          </UiTabsTrigger>
          <UiTabsTrigger value="bookings">
            Manage Bookings ({{ store.businessBookings.value.length }})
          </UiTabsTrigger>
          <UiTabsTrigger value="services">
            Services &amp; Pricing ({{ store.businessServices.value.length }})
          </UiTabsTrigger>
        </UiTabsList>

        <!-- Tab 1: Live Businesses API CRUD -->
        <UiTabsContent value="listings">
          <UiCard>
            <UiCardHeader>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <UiCardTitle>Registered Businesses</UiCardTitle>
                  <UiCardDescription>
                    Browse, create, update, or delete local Cambodian tourism businesses
                  </UiCardDescription>
                </div>
                <div class="flex items-center gap-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    :disabled="isLoadingBusinesses"
                    @click="loadBusinesses(currentPage)"
                  >
                    <RefreshCw
                      class="size-3.5"
                      :class="isLoadingBusinesses ? 'animate-spin' : ''"
                    />
                    Refresh
                  </UiButton>
                  <UiButton
                    variant="brand"
                    size="sm"
                    class="font-semibold"
                    @click="openCreateForm"
                  >
                    <Plus class="size-4" />
                    Add Business
                  </UiButton>
                </div>
              </div>
            </UiCardHeader>

            <UiCardContent class="space-y-4">
              <!-- Filters -->
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div class="relative sm:col-span-2">
                  <Search class="pointer-events-none absolute top-3 left-3.5 size-4 text-muted-foreground" />
                  <UiInput
                    v-model="searchQuery"
                    placeholder="Search business name or address..."
                    class="pl-10"
                  />
                </div>
                <CommonSearchableSelect
                  v-model="categoryFilter"
                  :options="filterCategoryOptions"
                  placeholder="All Categories"
                  search-placeholder="Search category..."
                  aria-label="Filter businesses by category"
                />
              </div>

              <div
                v-if="actionBanner"
                class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800"
              >
                <CheckCircle2 class="size-4 shrink-0" />
                <span>{{ actionBanner }}</span>
              </div>

              <div
                v-if="businessesError"
                class="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
              >
                <span class="inline-flex items-center gap-2">
                  <AlertCircle class="size-4 shrink-0" />
                  {{ businessesError }}
                </span>
                <UiButton
                  variant="outline"
                  size="sm"
                  @click="loadBusinesses(currentPage)"
                >
                  Retry
                </UiButton>
              </div>

              <div v-else-if="isLoadingBusinesses" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="h-44 animate-pulse rounded-2xl bg-muted"
                />
              </div>

              <div
                v-else-if="filteredBusinesses.length > 0"
                class="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div
                  v-for="biz in filteredBusinesses"
                  :key="biz.id"
                  class="flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 transition-shadow hover:shadow-sm"
                >
                  <div class="space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <UiBadge variant="brand" class="font-semibold">
                        {{ biz.category }}
                      </UiBadge>
                      <UiBadge
                        v-if="biz.status"
                        variant="outline"
                        class="capitalize"
                      >
                        {{ biz.status }}
                      </UiBadge>
                    </div>

                    <h3 class="text-base font-bold tracking-tight text-foreground">
                      {{ biz.name }}
                    </h3>

                    <p
                      v-if="biz.address"
                      class="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <MapPin class="mt-0.5 size-3.5 shrink-0" />
                      <span>{{ biz.address }}</span>
                    </p>

                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                      <span v-if="biz.phone" class="inline-flex items-center gap-1">
                        <Phone class="size-3.5" />
                        {{ biz.phone }}
                      </span>
                      <a
                        v-if="biz.website"
                        :href="biz.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      >
                        <Globe class="size-3.5" />
                        Website
                        <ExternalLink class="size-3" />
                      </a>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-3">
                    <NuxtLink :to="`/businesses/${biz.id}`">
                      <UiButton variant="outline" size="sm">View</UiButton>
                    </NuxtLink>
                    <UiButton
                      variant="outline"
                      size="sm"
                      @click="openEditForm(biz)"
                    >
                      <Pencil class="size-3.5" />
                      Edit
                    </UiButton>
                    <UiButton
                      variant="outline"
                      size="sm"
                      class="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      @click="openDeleteDialog(biz)"
                    >
                      <Trash2 class="size-3.5" />
                      Delete
                    </UiButton>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="rounded-2xl border border-dashed border-border py-12 text-center"
              >
                <p class="text-sm font-semibold">No businesses found</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  Register your first business or adjust your search filters.
                </p>
                <UiButton
                  variant="brand"
                  size="sm"
                  class="mt-4"
                  @click="openCreateForm"
                >
                  <Plus class="size-4" />
                  Register Business
                </UiButton>
              </div>

              <!-- Pagination -->
              <div
                v-if="paginationMeta && paginationMeta.last_page > 1"
                class="flex items-center justify-between border-t border-border/60 pt-4"
              >
                <p class="text-xs text-muted-foreground">
                  Page {{ paginationMeta.current_page }} of {{ paginationMeta.last_page }}
                  ({{ paginationMeta.total }} total)
                </p>
                <div class="flex items-center gap-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    :disabled="currentPage <= 1"
                    @click="loadBusinesses(currentPage - 1)"
                  >
                    <ChevronLeft class="size-4" />
                    Previous
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    :disabled="currentPage >= paginationMeta.last_page"
                    @click="loadBusinesses(currentPage + 1)"
                  >
                    Next
                    <ChevronRight class="size-4" />
                  </UiButton>
                </div>
              </div>
            </UiCardContent>
          </UiCard>
        </UiTabsContent>

        <!-- Tab 2: Bookings -->
        <UiTabsContent value="bookings">
          <UiCard>
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
        </UiTabsContent>

        <!-- Tab 3: Services & Pricing -->
        <UiTabsContent value="services">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <UiCard class="lg:col-span-5">
              <UiCardHeader>
                <UiCardTitle>Add New Service</UiCardTitle>
                <UiCardDescription>
                  List a room, menu package, tour, or transport option
                </UiCardDescription>
              </UiCardHeader>
              <UiCardContent>
                <form class="space-y-4" @submit.prevent="addService">
                  <div class="space-y-1.5">
                    <UiLabel for="srv-name">Service Name</UiLabel>
                    <UiInput
                      id="srv-name"
                      v-model="newService.name"
                      required
                      placeholder="e.g. Kampot Sunset Boat Tour"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <UiLabel>Business Category</UiLabel>
                    <CommonSearchableSelect
                      v-model="newService.category"
                      :options="businessTypeOptions"
                      placeholder="Select category"
                      search-placeholder="Search category..."
                      aria-label="Select business category"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1.5">
                      <UiLabel for="srv-price">Price ($ USD)</UiLabel>
                      <UiInput
                        id="srv-price"
                        v-model.number="newService.priceUsd"
                        type="number"
                        min="1"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <UiLabel for="srv-unit">Unit</UiLabel>
                      <UiInput
                        id="srv-unit"
                        v-model="newService.unit"
                        placeholder="per guest / night"
                      />
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
        </UiTabsContent>
      </UiTabs>

      <!-- Create / Edit Business Sheet -->
      <BusinessFormSheet
        v-model:open="formSheetOpen"
        :editing-business="editingBusiness"
        :default-user-id="authUser?.id ?? 1"
        :is-submitting="isSavingBusiness"
        :error-message="formError"
        @submit="handleSaveBusiness"
      />

      <!-- Delete Confirmation Modal -->
      <UiAlertDialog v-model:open="deleteDialogOpen">
        <UiAlertDialogContent>
          <UiAlertDialogHeader>
            <UiAlertDialogTitle>Delete business?</UiAlertDialogTitle>
            <UiAlertDialogDescription>
              This will permanently delete
              <span class="font-semibold text-foreground">
                {{ deletingTarget?.name }}
              </span>
              via DELETE /businesses/{{ deletingTarget?.id }}. This action cannot be undone.
            </UiAlertDialogDescription>
          </UiAlertDialogHeader>
          <UiAlertDialogFooter>
            <UiAlertDialogCancel :disabled="isDeletingBusiness">
              Cancel
            </UiAlertDialogCancel>
            <UiButton
              variant="default"
              class="bg-destructive text-white hover:bg-destructive/90"
              :disabled="isDeletingBusiness"
              @click="handleConfirmDelete"
            >
              <Loader2 v-if="isDeletingBusiness" class="size-4 animate-spin" />
              {{ isDeletingBusiness ? 'Deleting...' : 'Delete' }}
            </UiButton>
          </UiAlertDialogFooter>
        </UiAlertDialogContent>
      </UiAlertDialog>
    </main>

    <LayoutAppFooter />
  </div>
</template>
