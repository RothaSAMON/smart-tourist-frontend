<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Calendar,
  Heart,
  LogOut,
  MapPin,
  Sparkles,
  Star,
  Trash2,
} from '@lucide/vue'

useHead({
  title: 'My Profile & Trips — RokMerl',
})

const store = useTourismStore()
const activeTab = ref<'favorites' | 'plans' | 'reviews'>('favorites')

const favoriteAttractions = computed(() =>
  store.attractions.value.filter((item) => store.isFavorite(item.id)),
)

const recommendedForYou = computed(() =>
  store.attractions.value
    .filter((item) => !store.isFavorite(item.id))
    .slice(0, 3),
)

async function handleLogout() {
  store.logoutMock()
  await navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div
        class="flex flex-col justify-between gap-6 rounded-3xl bg-surface-sky p-6 sm:flex-row sm:items-center sm:p-8"
      >
        <div class="flex items-center gap-4">
          <UiAvatar class="size-16 border-2 border-white shadow-md">
            <UiAvatarImage
              :src="
                store.currentUser.value?.avatarUrl ??
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80'
              "
              alt="Tourist avatar"
            />
            <UiAvatarFallback>RM</UiAvatarFallback>
          </UiAvatar>
          <div>
            <UiBadge variant="brand" class="mb-1.5 font-semibold">
              Tourist Account
            </UiBadge>
            <h1 class="text-2xl font-bold tracking-tight">
              {{ store.currentUser.value?.name ?? 'Guest Traveler' }}
            </h1>
            <p class="text-sm text-muted-foreground">
              {{ store.currentUser.value?.email ?? 'Sign in to sync your Cambodia plans' }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <NuxtLink to="/planner">
            <UiButton variant="brand" size="sm" class="font-semibold">
              <Sparkles class="size-4" />
              New AI Trip Plan
            </UiButton>
          </NuxtLink>
          <UiButton
            v-if="store.currentUser.value"
            variant="outline"
            size="sm"
            @click="handleLogout"
          >
            <LogOut class="size-4" />
            Log out
          </UiButton>
          <NuxtLink v-else to="/auth/login">
            <UiButton variant="outline" size="sm">Log in</UiButton>
          </NuxtLink>
        </div>
      </div>

      <!-- shadcn-vue Tabs -->
      <UiTabs v-model="activeTab" class="mt-8">
        <UiTabsList>
          <UiTabsTrigger value="favorites">
            <Heart class="size-3.5" />
            Saved Favorites ({{ favoriteAttractions.length }})
          </UiTabsTrigger>
          <UiTabsTrigger value="plans">
            <Calendar class="size-3.5" />
            My Trip Plans ({{ store.savedPlans.value.length }})
          </UiTabsTrigger>
          <UiTabsTrigger value="reviews">
            <Star class="size-3.5" />
            Reviews &amp; Photos ({{ store.reviews.value.length }})
          </UiTabsTrigger>
        </UiTabsList>

        <!-- Tab 1: Favorites -->
        <UiTabsContent value="favorites">
          <div
            v-if="favoriteAttractions.length > 0"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <HomeDestinationCard
              v-for="item in favoriteAttractions"
              :key="item.id"
              :attraction="item"
              :is-favorite="true"
              @toggle-favorite="store.toggleFavorite"
            />
          </div>
          <div
            v-else
            class="rounded-2xl border border-dashed border-border py-14 text-center"
          >
            <p class="font-semibold">No saved attractions yet</p>
            <p class="mt-1 text-sm text-muted-foreground">
              Tap the heart icon on any Cambodian destination to save it here.
            </p>
            <NuxtLink to="/explore" class="mt-4 inline-block">
              <UiButton variant="brand" size="sm">Explore Cambodia</UiButton>
            </NuxtLink>
          </div>
        </UiTabsContent>

        <!-- Tab 2: Saved Trip Plans -->
        <UiTabsContent value="plans" class="space-y-5">
          <UiCard v-for="plan in store.savedPlans.value" :key="plan.id">
            <UiCardHeader>
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <UiBadge variant="brand">{{ plan.province }}</UiBadge>
                    <UiBadge variant="secondary">{{ plan.daysCount }} Days</UiBadge>
                    <UiBadge variant="outline">
                      Est. ${{ plan.estimatedTotalUsd }} / ${{ plan.budgetUsd }}
                    </UiBadge>
                  </div>
                  <UiCardTitle class="mt-2 text-lg">{{ plan.title }}</UiCardTitle>
                  <UiCardDescription>{{ plan.prompt }}</UiCardDescription>
                </div>
                <UiButton
                  variant="ghost"
                  size="icon"
                  aria-label="Delete trip plan"
                  @click="store.removeTripPlan(plan.id)"
                >
                  <Trash2 class="size-4 text-muted-foreground" />
                </UiButton>
              </div>
            </UiCardHeader>
            <UiCardContent>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div
                  v-for="day in plan.days"
                  :key="day.day"
                  class="rounded-xl bg-muted/40 p-3.5 text-xs"
                >
                  <p class="font-bold text-foreground">
                    Day {{ day.day }}: {{ day.theme }}
                  </p>
                  <ul class="mt-2 space-y-1.5 text-muted-foreground">
                    <li v-for="(stop, idx) in day.stops" :key="idx">
                      <span class="font-semibold text-foreground">{{ stop.timeOfDay }}:</span>
                      {{ stop.title }}
                    </li>
                  </ul>
                </div>
              </div>
            </UiCardContent>
          </UiCard>
        </UiTabsContent>

        <!-- Tab 3: Reviews -->
        <UiTabsContent value="reviews">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UiCard v-for="rev in store.reviews.value" :key="rev.id">
              <UiCardContent class="space-y-3">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold">{{ rev.author }}</p>
                  <span class="inline-flex items-center gap-1 text-xs font-semibold">
                    <Star class="size-3.5 fill-amber-400 text-amber-400" />
                    {{ rev.rating }}.0
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">{{ rev.comment }}</p>
                <img
                  v-if="rev.photoUrl"
                  :src="rev.photoUrl"
                  alt="Uploaded travel photo"
                  class="h-36 w-full rounded-xl object-cover"
                />
                <NuxtLink
                  :to="`/attractions/${rev.attractionId}`"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-foreground underline underline-offset-4"
                >
                  <MapPin class="size-3" />
                  View Attraction
                </NuxtLink>
              </UiCardContent>
            </UiCard>
          </div>
        </UiTabsContent>
      </UiTabs>

      <!-- Personalized Recommendations -->
      <section class="mt-14">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold tracking-tight">
              Recommended Next for You
            </h2>
            <p class="text-sm text-muted-foreground">
              Based on your saved Cambodian favorites and travel style
            </p>
          </div>
          <NuxtLink to="/explore" class="text-sm font-semibold underline underline-offset-4">
            Browse all
          </NuxtLink>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <HomeDestinationCard
            v-for="item in recommendedForYou"
            :key="item.id"
            :attraction="item"
            :is-favorite="store.isFavorite(item.id)"
            @toggle-favorite="store.toggleFavorite"
          />
        </div>
      </section>
    </main>

    <LayoutAppFooter />
  </div>
</template>
