<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Landmark,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from '@lucide/vue'
import { CAMBODIA_PROVINCES, DESTINATION_CATEGORIES } from '@/data/home'
import type {
  ApiAttraction,
  ApiPaginationMeta,
  AttractionMutationPayload,
} from '@/types/attraction-api'
import type { AdminBusinessRecord } from '@/types/tourism'

useHead({
  title: 'Admin Console — RokMerl',
})

const store = useTourismStore()
const {
  fetchAttractions,
  createAttraction,
  updateAttraction,
  deleteAttraction,
} = useAttractionsApi()

const activeTab = ref<
  'attractions' | 'businesses' | 'taxonomy' | 'reports' | 'recommendations'
>('attractions')

// Live Attractions CRUD State
const apiAttractions = ref<ApiAttraction[]>([])
const paginationMeta = ref<ApiPaginationMeta | null>(null)
const currentPage = ref(1)
const isLoadingAttractions = ref(true)
const attractionsError = ref('')

const formSheetOpen = ref(false)
const editingAttraction = ref<ApiAttraction | null>(null)
const isSavingAttraction = ref(false)
const formError = ref('')

const deletingTarget = ref<ApiAttraction | null>(null)
const deleteDialogOpen = ref(false)
const isDeletingAttraction = ref(false)
const actionBanner = ref('')

const provinceSelectOptions = computed(() => {
  const map = new Map<string, string>([
    ['1', 'Siem Reap'],
    ['2', 'Phnom Penh'],
    ['3', 'Preah Sihanouk'],
    ['4', 'Kampot'],
    ['5', 'Kep'],
    ['6', 'Battambang'],
  ])
  const list = Array.isArray(apiAttractions.value) ? apiAttractions.value : []
  for (const item of list) {
    if (item.province?.id && item.province?.name) {
      map.set(String(item.province.id), item.province.name)
    }
  }
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
})

const categorySelectOptions = computed(() => {
  const map = new Map<string, string>([
    ['1', 'Historical & Temples'],
    ['2', 'Nature & Parks'],
    ['3', 'Islands & Beaches'],
    ['4', 'Culture & Museums'],
    ['5', 'Food & Nightlife'],
  ])
  const list = Array.isArray(apiAttractions.value) ? apiAttractions.value : []
  for (const item of list) {
    if (item.category?.id && item.category?.name) {
      map.set(String(item.category.id), item.category.name)
    }
  }
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
})

async function loadAttractions(page = currentPage.value) {
  isLoadingAttractions.value = true
  attractionsError.value = ''
  try {
    const res = await fetchAttractions(page)
    apiAttractions.value = Array.isArray(res?.raw) ? res.raw : []
    paginationMeta.value = res?.meta ?? null
    currentPage.value = res?.meta?.current_page ?? page
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    attractionsError.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Unable to fetch attractions from API.'
  } finally {
    isLoadingAttractions.value = false
  }
}

onMounted(() => {
  loadAttractions(1)
})

function openCreateForm() {
  editingAttraction.value = null
  formError.value = ''
  formSheetOpen.value = true
}

function openEditForm(item: ApiAttraction) {
  editingAttraction.value = item
  formError.value = ''
  formSheetOpen.value = true
}

function openDeleteDialog(item: ApiAttraction) {
  deletingTarget.value = item
  deleteDialogOpen.value = true
}

async function handleSaveAttraction(payload: AttractionMutationPayload) {
  if (isSavingAttraction.value) return
  isSavingAttraction.value = true
  formError.value = ''
  try {
    if (editingAttraction.value) {
      await updateAttraction(editingAttraction.value.id, payload)
      actionBanner.value = `Updated "${payload.name}" successfully.`
    } else {
      await createAttraction(payload)
      actionBanner.value = `Created "${payload.name}" successfully.`
    }
    formSheetOpen.value = false
    await loadAttractions(currentPage.value)
    setTimeout(() => {
      actionBanner.value = ''
    }, 3500)
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    formError.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Failed to save attraction.'
  } finally {
    isSavingAttraction.value = false
  }
}

async function handleConfirmDelete() {
  if (!deletingTarget.value || isDeletingAttraction.value) return
  isDeletingAttraction.value = true
  try {
    const targetName = deletingTarget.value.name
    await deleteAttraction(deletingTarget.value.id)
    deleteDialogOpen.value = false
    deletingTarget.value = null
    actionBanner.value = `Deleted "${targetName}" successfully.`
    await loadAttractions(currentPage.value)
    setTimeout(() => {
      actionBanner.value = ''
    }, 3500)
  } catch (err) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    attractionsError.value =
      fetchErr?.data?.message ||
      fetchErr?.message ||
      'Failed to delete attraction.'
  } finally {
    isDeletingAttraction.value = false
  }
}

const ratingWeight = ref([85])
const budgetWeight = ref([90])
const weatherWeight = ref([70])
const proximityWeight = ref([80])
const weightsSaved = ref(false)

const openReportsCount = computed(
  () => store.adminReports.value.filter((r) => r.status === 'open').length,
)

function setBusinessStatus(id: string, status: AdminBusinessRecord['status']) {
  store.adminBusinesses.value = store.adminBusinesses.value.map((b) =>
    b.id === id ? { ...b, status } : b,
  )
}

function resolveReport(id: string) {
  store.adminReports.value = store.adminReports.value.map((r) =>
    r.id === id ? { ...r, status: 'resolved' } : r,
  )
}

function saveWeights() {
  weightsSaved.value = true
  setTimeout(() => {
    weightsSaved.value = false
  }, 2500)
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 rounded-3xl bg-neutral-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <UiBadge variant="brand" class="font-bold">
            <ShieldCheck class="size-3.5" />
            Administrator Console
          </UiBadge>
          <h1 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            RokMerl Platform Management
          </h1>
          <p class="mt-1 text-sm text-white/75">
            Manage attractions, categories, provinces, users, businesses, reports, reviews, and AI recommendations.
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs text-white/80">
          <BarChart3 class="size-4 text-brand-lime" />
          <span>System Status: Healthy (Fixed Data Mode)</span>
        </div>
      </div>

      <!-- Analytics KPIs -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Total Attractions</p>
              <p class="mt-1 text-2xl font-bold">
                {{ paginationMeta?.total ?? apiAttractions.length }}
              </p>
              <p class="text-xs text-muted-foreground">Live from /attractions API</p>
            </div>
            <Landmark class="size-8 text-neutral-700 dark:text-neutral-300" />
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Registered Tourists</p>
              <p class="mt-1 text-2xl font-bold">12,480</p>
              <p class="text-xs text-emerald-600">+14% this month</p>
            </div>
            <Users class="size-8 text-neutral-700" />
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Partner Businesses</p>
              <p class="mt-1 text-2xl font-bold">{{ store.adminBusinesses.value.length }}</p>
              <p class="text-xs text-amber-600">
                {{ store.adminBusinesses.value.filter((b) => b.status === 'pending').length }} pending approval
              </p>
            </div>
            <Building2 class="size-8 text-neutral-700" />
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted-foreground">Open Reports</p>
              <p class="mt-1 text-2xl font-bold">{{ openReportsCount }}</p>
              <p class="text-xs text-muted-foreground">{{ store.reviews.value.length }} total reviews</p>
            </div>
            <Flag class="size-8 text-rose-500" />
          </UiCardContent>
        </UiCard>
      </div>

      <!-- shadcn-vue Tabs -->
      <UiTabs v-model="activeTab" class="mt-8">
        <UiTabsList>
          <UiTabsTrigger value="attractions">
            Attractions ({{ paginationMeta?.total ?? apiAttractions.length }})
          </UiTabsTrigger>
          <UiTabsTrigger value="businesses">
            Businesses &amp; Users
          </UiTabsTrigger>
          <UiTabsTrigger value="taxonomy">
            Provinces &amp; Categories
          </UiTabsTrigger>
          <UiTabsTrigger value="reports">
            Reports &amp; Reviews ({{ openReportsCount }})
          </UiTabsTrigger>
          <UiTabsTrigger value="recommendations">
            <Sparkles class="size-3.5" />
            AI Recommendation Rules
          </UiTabsTrigger>
        </UiTabsList>

        <!-- Tab 1: Attractions (Live CRUD) -->
        <UiTabsContent value="attractions">
          <UiCard>
            <UiCardHeader>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <UiCardTitle>Cambodia Attractions Directory</UiCardTitle>
                  <UiCardDescription>
                    Create, update, or delete attractions directly via /attractions API
                  </UiCardDescription>
                </div>
                <div class="flex items-center gap-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    :disabled="isLoadingAttractions"
                    @click="loadAttractions(currentPage)"
                  >
                    <RefreshCw
                      class="size-3.5"
                      :class="isLoadingAttractions ? 'animate-spin' : ''"
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
                    Add Attraction
                  </UiButton>
                </div>
              </div>
            </UiCardHeader>

            <UiCardContent class="space-y-3">
              <div
                v-if="actionBanner"
                class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800"
              >
                <CheckCircle2 class="size-4 shrink-0" />
                <span>{{ actionBanner }}</span>
              </div>

              <div
                v-if="attractionsError"
                class="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
              >
                <span class="inline-flex items-center gap-2">
                  <AlertCircle class="size-4 shrink-0" />
                  {{ attractionsError }}
                </span>
                <UiButton
                  variant="outline"
                  size="sm"
                  @click="loadAttractions(currentPage)"
                >
                  Retry
                </UiButton>
              </div>

              <div v-else-if="isLoadingAttractions" class="space-y-3">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="h-20 animate-pulse rounded-2xl bg-muted"
                />
              </div>

              <template v-else-if="apiAttractions.length > 0">
                <div
                  v-for="item in apiAttractions"
                  :key="item.id"
                  class="flex flex-col justify-between gap-3 rounded-2xl border border-border/80 p-3.5 sm:flex-row sm:items-center"
                >
                  <div class="flex items-center gap-3.5">
                    <img
                      :src="
                        item.image_url ||
                        item.image ||
                        '/images/attraction-placeholder.svg'
                      "
                      :alt="item.name"
                      class="size-14 shrink-0 rounded-xl object-cover"
                    />
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold">
                        {{ item.name }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ item.province?.name || `Province #${item.province_id}` }} ·
                        {{ item.category?.name || `Category #${item.category_id}` }} ·
                        {{
                          item.entrance_fee && item.entrance_fee > 0
                            ? `$${item.entrance_fee}`
                            : 'Free Entry'
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    <UiBadge variant="secondary">
                      ★ {{ Number(item.average_rating ?? 0).toFixed(1) }}
                    </UiBadge>
                    <NuxtLink :to="`/attractions/${item.id}`">
                      <UiButton variant="outline" size="sm">View</UiButton>
                    </NuxtLink>
                    <UiButton
                      variant="outline"
                      size="sm"
                      @click="openEditForm(item)"
                    >
                      <Pencil class="size-3.5" />
                      Edit
                    </UiButton>
                    <UiButton
                      variant="outline"
                      size="sm"
                      class="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      @click="openDeleteDialog(item)"
                    >
                      <Trash2 class="size-3.5" />
                      Delete
                    </UiButton>
                  </div>
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
                      @click="loadAttractions(currentPage - 1)"
                    >
                      <ChevronLeft class="size-4" />
                      Previous
                    </UiButton>
                    <UiButton
                      variant="outline"
                      size="sm"
                      :disabled="currentPage >= paginationMeta.last_page"
                      @click="loadAttractions(currentPage + 1)"
                    >
                      Next
                      <ChevronRight class="size-4" />
                    </UiButton>
                  </div>
                </div>
              </template>

              <div
                v-else
                class="rounded-2xl border border-dashed border-border py-12 text-center"
              >
                <p class="text-sm font-semibold">No attractions found</p>
                <UiButton
                  variant="brand"
                  size="sm"
                  class="mt-3"
                  @click="openCreateForm"
                >
                  <Plus class="size-4" />
                  Create First Attraction
                </UiButton>
              </div>
            </UiCardContent>
          </UiCard>

          <!-- Create / Edit Attraction Sheet -->
          <AdminAttractionFormSheet
            v-model:open="formSheetOpen"
            :editing-attraction="editingAttraction"
            :province-options="provinceSelectOptions"
            :category-options="categorySelectOptions"
            :is-submitting="isSavingAttraction"
            :error-message="formError"
            @submit="handleSaveAttraction"
          />

          <!-- Delete Confirmation Modal -->
          <UiAlertDialog v-model:open="deleteDialogOpen">
            <UiAlertDialogContent>
              <UiAlertDialogHeader>
                <UiAlertDialogTitle>Delete attraction?</UiAlertDialogTitle>
                <UiAlertDialogDescription>
                  This will permanently delete
                  <span class="font-semibold text-foreground">
                    {{ deletingTarget?.name }}
                  </span>. This action cannot be undone.
                </UiAlertDialogDescription>
              </UiAlertDialogHeader>
              <UiAlertDialogFooter>
                <UiAlertDialogCancel :disabled="isDeletingAttraction">
                  Cancel
                </UiAlertDialogCancel>
                <UiButton
                  variant="default"
                  class="bg-destructive text-white hover:bg-destructive/90"
                  :disabled="isDeletingAttraction"
                  @click="handleConfirmDelete"
                >
                  <Loader2 v-if="isDeletingAttraction" class="size-4 animate-spin" />
                  {{ isDeletingAttraction ? 'Deleting...' : 'Delete' }}
                </UiButton>
              </UiAlertDialogFooter>
            </UiAlertDialogContent>
          </UiAlertDialog>
        </UiTabsContent>

        <!-- Tab 2: Businesses -->
        <UiTabsContent value="businesses">
          <UiCard>
            <UiCardHeader>
              <UiCardTitle>Business Approvals &amp; Directory</UiCardTitle>
              <UiCardDescription>
                Approve new local businesses or manage active partners
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent class="space-y-3">
              <div
                v-for="biz in store.adminBusinesses.value"
                :key="biz.id"
                class="flex flex-col justify-between gap-3 rounded-2xl border border-border/80 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold">{{ biz.name }}</p>
                    <UiBadge
                      :variant="
                        biz.status === 'active'
                          ? 'brand'
                          : biz.status === 'pending'
                            ? 'secondary'
                            : 'outline'
                      "
                    >
                      {{ biz.status }}
                    </UiBadge>
                  </div>
                  <p class="mt-0.5 text-xs text-muted-foreground">
                    Owner: {{ biz.owner }} · {{ biz.type }} · {{ biz.province }} ·
                    {{ biz.monthlyViews.toLocaleString() }} views/mo
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <UiButton
                    v-if="biz.status !== 'active'"
                    variant="brand"
                    size="sm"
                    @click="setBusinessStatus(biz.id, 'active')"
                  >
                    Approve
                  </UiButton>
                  <UiButton
                    v-if="biz.status === 'active'"
                    variant="outline"
                    size="sm"
                    @click="setBusinessStatus(biz.id, 'suspended')"
                  >
                    Suspend
                  </UiButton>
                </div>
              </div>
            </UiCardContent>
          </UiCard>
        </UiTabsContent>

        <!-- Tab 3: Provinces & Categories -->
        <UiTabsContent value="taxonomy">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <UiCard>
              <UiCardHeader>
                <UiCardTitle>Active Provinces</UiCardTitle>
              </UiCardHeader>
              <UiCardContent class="flex flex-wrap gap-2">
                <UiBadge v-for="p in CAMBODIA_PROVINCES" :key="p" variant="secondary" class="px-3.5 py-1.5">
                  <MapPin class="size-3" />
                  {{ p }}
                </UiBadge>
              </UiCardContent>
            </UiCard>

            <UiCard>
              <UiCardHeader>
                <UiCardTitle>Attraction Categories</UiCardTitle>
              </UiCardHeader>
              <UiCardContent class="flex flex-wrap gap-2">
                <UiBadge
                  v-for="c in DESTINATION_CATEGORIES.filter((cat) => cat !== 'All')"
                  :key="c"
                  variant="brand"
                  class="px-3.5 py-1.5"
                >
                  {{ c }}
                </UiBadge>
              </UiCardContent>
            </UiCard>
          </div>
        </UiTabsContent>

        <!-- Tab 4: Reports & Reviews -->
        <UiTabsContent value="reports">
          <UiCard>
            <UiCardHeader>
              <UiCardTitle>Moderation Queue</UiCardTitle>
              <UiCardDescription>
                Resolve flagged reviews, ticket updates, and business reports
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent class="space-y-3">
              <div
                v-for="rep in store.adminReports.value"
                :key="rep.id"
                class="flex flex-col justify-between gap-3 rounded-2xl border border-border/80 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <UiBadge variant="secondary">{{ rep.targetType }}</UiBadge>
                    <p class="text-sm font-semibold">{{ rep.targetName }}</p>
                  </div>
                  <p class="mt-0.5 text-xs text-muted-foreground">
                    Reason: {{ rep.reason }} · Reported by {{ rep.reportedBy }} on {{ rep.date }}
                  </p>
                </div>

                <div>
                  <UiButton
                    v-if="rep.status === 'open'"
                    variant="brand"
                    size="sm"
                    @click="resolveReport(rep.id)"
                  >
                    <CheckCircle2 class="size-3.5" />
                    Mark Resolved
                  </UiButton>
                  <UiBadge v-else variant="outline">Resolved</UiBadge>
                </div>
              </div>
            </UiCardContent>
          </UiCard>
        </UiTabsContent>

        <!-- Tab 5: AI Recommendation Engine Tuning -->
        <UiTabsContent value="recommendations">
          <UiCard>
            <UiCardHeader>
              <UiCardTitle>AI Recommendation Scoring Weights</UiCardTitle>
              <UiCardDescription>
                Configure how RokMerl ranks attractions in the AI Trip Planner
              </UiCardDescription>
            </UiCardHeader>
            <UiCardContent class="max-w-xl space-y-6">
              <div class="space-y-2.5">
                <div class="flex justify-between text-xs font-semibold">
                  <UiLabel>User Ratings &amp; Reviews Weight</UiLabel>
                  <span>{{ ratingWeight[0] }}%</span>
                </div>
                <UiSlider v-model="ratingWeight" :max="100" :step="1" />
              </div>

              <div class="space-y-2.5">
                <div class="flex justify-between text-xs font-semibold">
                  <UiLabel>Budget Fit Priority</UiLabel>
                  <span>{{ budgetWeight[0] }}%</span>
                </div>
                <UiSlider v-model="budgetWeight" :max="100" :step="1" />
              </div>

              <div class="space-y-2.5">
                <div class="flex justify-between text-xs font-semibold">
                  <UiLabel>Weather &amp; Travel Season Adaptation</UiLabel>
                  <span>{{ weatherWeight[0] }}%</span>
                </div>
                <UiSlider v-model="weatherWeight" :max="100" :step="1" />
              </div>

              <div class="space-y-2.5">
                <div class="flex justify-between text-xs font-semibold">
                  <UiLabel>Nearby Attractions &amp; Dining Clustering</UiLabel>
                  <span>{{ proximityWeight[0] }}%</span>
                </div>
                <UiSlider v-model="proximityWeight" :max="100" :step="1" />
              </div>

              <div class="flex items-center gap-3 pt-2">
                <UiButton variant="brand" class="font-semibold" @click="saveWeights">
                  Save AI Configuration
                </UiButton>
                <span v-if="weightsSaved" class="text-xs font-semibold text-emerald-700">
                  Saved recommendation weights!
                </span>
              </div>
            </UiCardContent>
          </UiCard>
        </UiTabsContent>
      </UiTabs>
    </main>

    <LayoutAppFooter />
  </div>
</template>
