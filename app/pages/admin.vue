<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Flag,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from '@lucide/vue'
import { CAMBODIA_PROVINCES, DESTINATION_CATEGORIES } from '@/data/home'
import type { AdminBusinessRecord } from '@/types/tourism'

useHead({
  title: 'Admin Console — SmartTour Cambodia',
})

const store = useTourismStore()
const activeTab = ref<
  'attractions' | 'businesses' | 'taxonomy' | 'reports' | 'recommendations'
>('attractions')

const aiWeights = ref({
  ratingWeight: 85,
  budgetWeight: 90,
  weatherWeight: 70,
  proximityWeight: 80,
})
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
          <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-3 py-1 text-xs font-bold text-brand-lime-foreground">
            <ShieldCheck class="size-3.5" />
            Administrator Console
          </span>
          <h1 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            SmartTour Cambodia Platform Management
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
              <p class="mt-1 text-2xl font-bold">{{ store.attractions.value.length }}</p>
              <p class="text-xs text-muted-foreground">Across {{ CAMBODIA_PROVINCES.length }} provinces</p>
            </div>
            <Landmark class="size-8 text-neutral-700" />
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

      <!-- Navigation Tabs -->
      <div class="mt-8 flex flex-wrap gap-2">
        <UiButton
          size="sm"
          :variant="activeTab === 'attractions' ? 'brand' : 'outline'"
          @click="activeTab = 'attractions'"
        >
          Attractions ({{ store.attractions.value.length }})
        </UiButton>
        <UiButton
          size="sm"
          :variant="activeTab === 'businesses' ? 'brand' : 'outline'"
          @click="activeTab = 'businesses'"
        >
          Businesses &amp; Users
        </UiButton>
        <UiButton
          size="sm"
          :variant="activeTab === 'taxonomy' ? 'brand' : 'outline'"
          @click="activeTab = 'taxonomy'"
        >
          Provinces &amp; Categories
        </UiButton>
        <UiButton
          size="sm"
          :variant="activeTab === 'reports' ? 'brand' : 'outline'"
          @click="activeTab = 'reports'"
        >
          Reports &amp; Reviews ({{ openReportsCount }})
        </UiButton>
        <UiButton
          size="sm"
          :variant="activeTab === 'recommendations' ? 'brand' : 'outline'"
          @click="activeTab = 'recommendations'"
        >
          <Sparkles class="size-3.5" />
          AI Recommendation Rules
        </UiButton>
      </div>

      <!-- Tab 1: Attractions -->
      <UiCard v-if="activeTab === 'attractions'" class="mt-6">
        <UiCardHeader>
          <UiCardTitle>Cambodia Attractions Directory</UiCardTitle>
          <UiCardDescription>
            Review published attractions, ticket prices, and ratings
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-3">
          <div
            v-for="item in store.attractions.value"
            :key="item.id"
            class="flex flex-col justify-between gap-3 rounded-2xl border border-border/80 p-3.5 sm:flex-row sm:items-center"
          >
            <div class="flex items-center gap-3.5">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="size-14 rounded-xl object-cover"
              />
              <div>
                <p class="text-sm font-semibold">{{ item.name }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ item.province }} · {{ item.category }} · {{ item.entryFee }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2.5">
              <UiBadge variant="secondary">★ {{ item.rating.toFixed(1) }}</UiBadge>
              <NuxtLink :to="`/attractions/${item.id}`">
                <UiButton variant="outline" size="sm">Inspect</UiButton>
              </NuxtLink>
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Tab 2: Businesses -->
      <UiCard v-else-if="activeTab === 'businesses'" class="mt-6">
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

      <!-- Tab 3: Provinces & Categories -->
      <div v-else-if="activeTab === 'taxonomy'" class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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

      <!-- Tab 4: Reports & Reviews -->
      <UiCard v-else-if="activeTab === 'reports'" class="mt-6">
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

      <!-- Tab 5: AI Recommendation Engine Tuning -->
      <UiCard v-else class="mt-6">
        <UiCardHeader>
          <UiCardTitle>AI Recommendation Scoring Weights</UiCardTitle>
          <UiCardDescription>
            Configure how SmartTour ranks attractions in the AI Trip Planner
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="max-w-xl space-y-5">
          <div>
            <div class="flex justify-between text-xs font-semibold">
              <span>User Ratings &amp; Reviews Weight</span>
              <span>{{ aiWeights.ratingWeight }}%</span>
            </div>
            <input v-model.number="aiWeights.ratingWeight" type="range" min="0" max="100" class="mt-1.5 w-full accent-neutral-900" />
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold">
              <span>Budget Fit Priority</span>
              <span>{{ aiWeights.budgetWeight }}%</span>
            </div>
            <input v-model.number="aiWeights.budgetWeight" type="range" min="0" max="100" class="mt-1.5 w-full accent-neutral-900" />
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold">
              <span>Weather &amp; Travel Season Adaptation</span>
              <span>{{ aiWeights.weatherWeight }}%</span>
            </div>
            <input v-model.number="aiWeights.weatherWeight" type="range" min="0" max="100" class="mt-1.5 w-full accent-neutral-900" />
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold">
              <span>Nearby Attractions &amp; Dining Clustering</span>
              <span>{{ aiWeights.proximityWeight }}%</span>
            </div>
            <input v-model.number="aiWeights.proximityWeight" type="range" min="0" max="100" class="mt-1.5 w-full accent-neutral-900" />
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
    </main>

    <LayoutAppFooter />
  </div>
</template>
