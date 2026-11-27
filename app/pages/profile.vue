<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Calendar,
  Heart,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from '@lucide/vue'

useHead({
  title: 'My Profile & Trips — RokMerl',
})

const store = useTourismStore()
const { user: authUser, isAuthenticated, fetchMe, logout } = useAuth()
const activeTab = ref<'favorites' | 'plans' | 'reviews'>('favorites')
const isLoadingProfile = ref(false)
const logoutDialogOpen = ref(false)
const isLoggingOut = ref(false)

const profile = computed(() => {
  if (authUser.value) {
    return {
      id: authUser.value.id,
      name: authUser.value.name,
      email: authUser.value.email,
      phone: authUser.value.phone,
      status: authUser.value.status,
      roles: authUser.value.roles ?? [],
      avatarUrl: authUser.value.avatarUrl || '/icons/profile.png',
    }
  }
  if (store.currentUser.value) {
    return {
      id: store.currentUser.value.id,
      name: store.currentUser.value.name,
      email: store.currentUser.value.email,
      phone: store.currentUser.value.phone,
      status: store.currentUser.value.status,
      roles: store.currentUser.value.roles ?? [store.currentUser.value.role],
      avatarUrl: store.currentUser.value.avatarUrl || '/icons/profile.png',
    }
  }
  return null
})

onMounted(async () => {
  if (isAuthenticated.value) {
    isLoadingProfile.value = true
    await fetchMe()
    isLoadingProfile.value = false
  }
})

const favoriteAttractions = computed(() =>
  store.attractions.value.filter((item) => store.isFavorite(item.id)),
)

const recommendedForYou = computed(() =>
  store.attractions.value
    .filter((item) => !store.isFavorite(item.id))
    .slice(0, 3),
)

async function handleConfirmLogout() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    await logout()
    logoutDialogOpen.value = false
    await navigateTo('/auth/login')
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div class="rounded-3xl bg-surface-sky p-6 sm:p-8">
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div class="flex items-center gap-4">
            <UiAvatar class="size-16 border-2 border-white shadow-md">
              <UiAvatarImage
                :src="profile?.avatarUrl || '/icons/profile.png'"
                :alt="profile?.name || 'User avatar'"
              />
              <UiAvatarFallback>
                {{ (profile?.name || 'RM').slice(0, 2).toUpperCase() }}
              </UiAvatarFallback>
            </UiAvatar>
            <div>
              <div class="mb-1.5 flex flex-wrap items-center gap-1.5">
                <UiBadge
                  v-for="roleName in profile?.roles?.length ? profile.roles : ['Guest']"
                  :key="roleName"
                  variant="brand"
                  class="font-semibold"
                >
                  {{ roleName }}
                </UiBadge>
                <UiBadge
                  v-if="profile?.status"
                  variant="outline"
                  class="gap-1.5 bg-white/80 capitalize"
                >
                  <span
                    class="size-2 rounded-full"
                    :class="
                      profile.status.toLowerCase() === 'active'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    "
                  />
                  {{ profile.status }}
                </UiBadge>
              </div>
              <h1 class="text-2xl font-bold tracking-tight">
                {{ profile?.name ?? 'Guest Traveler' }}
              </h1>
              <p class="text-sm text-muted-foreground">
                {{ profile?.email ?? 'Sign in to view your account details and sync your Cambodia plans' }}
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
            <UiAlertDialog v-if="profile" v-model:open="logoutDialogOpen">
              <UiAlertDialogTrigger as-child>
                <UiButton variant="outline" size="sm">
                  <LogOut class="size-4" />
                  Log out
                </UiButton>
              </UiAlertDialogTrigger>
              <UiAlertDialogContent>
                <UiAlertDialogHeader>
                  <UiAlertDialogTitle>Log out of RokMerl?</UiAlertDialogTitle>
                  <UiAlertDialogDescription>
                    You will be signed out of your account <span class="underline">{{ profile.email }}</span> from RokMerl.
                  </UiAlertDialogDescription>
                </UiAlertDialogHeader>
                <UiAlertDialogFooter>
                  <UiAlertDialogCancel :disabled="isLoggingOut">
                    Cancel
                  </UiAlertDialogCancel>
                  <UiButton
                    variant="default"
                    class="bg-destructive text-white hover:bg-destructive/90"
                    :disabled="isLoggingOut"
                    @click="handleConfirmLogout"
                  >
                    <Loader2 v-if="isLoggingOut" class="size-4 animate-spin" />
                    {{ isLoggingOut ? 'Logging out...' : 'Log out' }}
                  </UiButton>
                </UiAlertDialogFooter>
              </UiAlertDialogContent>
            </UiAlertDialog>
            <NuxtLink v-else to="/auth/login">
              <UiButton variant="outline" size="sm">Log in</UiButton>
            </NuxtLink>
          </div>
        </div>

        <!-- Account Information Strip from /me & /auth/login -->
        <div
          v-if="profile"
          class="mt-6 grid grid-cols-1 gap-3 border-t border-border/70 pt-5 sm:grid-cols-3"
        >
          <div class="flex items-center gap-3 rounded-2xl bg-card/90 px-4 py-3">
            <Mail class="size-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] font-medium text-muted-foreground">Email</p>
              <p class="truncate text-sm font-semibold text-foreground">
                {{ profile.email }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-2xl bg-card/90 px-4 py-3">
            <Phone class="size-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] font-medium text-muted-foreground">Phone</p>
              <p class="truncate text-sm font-semibold text-foreground">
                {{ profile.phone || 'Not provided' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-2xl bg-card/90 px-4 py-3">
            <ShieldCheck class="size-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] font-medium text-muted-foreground">Status &amp; Roles</p>
              <p class="truncate text-sm font-semibold capitalize text-foreground">
                {{ profile.status || 'active' }} · {{ profile.roles.join(', ') || 'User' }}
              </p>
            </div>
          </div>
        </div>

        <p v-if="isLoadingProfile" class="mt-3 text-xs text-muted-foreground">
          Syncing latest profile from server...
        </p>
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
