<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  Building2,
  Compass,
  Heart,
  Home,
  Map as MapIcon,
  Menu,
  ShieldCheck,
  Sparkles,
  User,
} from '@lucide/vue'

interface Props {
  variant?: 'transparent' | 'solid'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'transparent',
})

const route = useRoute()
const { currentUser, favoriteIds } = useTourismStore()

const navLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Explore', to: '/explore', icon: MapIcon },
  { label: 'AI Planner', to: '/planner', icon: Sparkles },
  { label: 'Business', to: '/business', icon: Building2 },
  { label: 'Admin', to: '/admin', icon: ShieldCheck },
]

const sidebarOpen = ref(false)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 120
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <header
    class="relative z-30 w-full"
    :class="
      props.variant === 'solid'
        ? 'sticky top-0 border-b border-border/80 bg-background/90 backdrop-blur-md'
        : ''
    "
  >
    <nav
      class="mx-auto flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10"
      :class="props.variant === 'solid' ? 'max-w-7xl' : ''"
      aria-label="Main navigation"
    >
      <!-- Brand -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5"
        :class="props.variant === 'solid' ? 'text-foreground' : 'text-white'"
      >
        <span
          class="flex size-9 items-center justify-center rounded-xl shadow-sm"
          :class="
            props.variant === 'solid'
              ? 'bg-brand-lime text-brand-lime-foreground'
              : 'bg-white/95 text-neutral-900'
          "
        >
          <Compass class="size-5" />
        </span>
        <span class="text-lg font-semibold tracking-tight">RokMerl</span>
      </NuxtLink>

      <!-- Desktop Links -->
      <ul class="hidden items-center gap-7 md:flex">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            :class="[
              props.variant === 'solid'
                ? isActive(link.to)
                  ? 'font-semibold text-foreground underline decoration-brand-lime decoration-2 underline-offset-8'
                  : 'text-muted-foreground hover:text-foreground'
                : isActive(link.to)
                  ? 'font-semibold text-brand-lime'
                  : 'text-white/90 hover:text-brand-lime',
            ]"
          >
            <Sparkles v-if="link.to === '/planner'" class="size-3.5" />
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Right Actions (Desktop) -->
      <div class="hidden items-center gap-2.5 md:flex">
        <CommonThemeToggle :variant="props.variant" />

        <NuxtLink
          to="/profile"
          class="relative flex size-9 items-center justify-center rounded-full border transition-colors"
          :class="
            props.variant === 'solid'
              ? 'border-border bg-background text-foreground hover:bg-muted'
              : 'border-white/25 bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
          "
          aria-label="Saved favorites and tourist profile"
        >
          <Heart class="size-4" />
          <span
            v-if="favoriteIds.length > 0"
            class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-lime text-[10px] font-bold text-brand-lime-foreground"
          >
            {{ favoriteIds.length }}
          </span>
        </NuxtLink>

        <NuxtLink v-if="currentUser" to="/profile">
          <UiButton variant="brand" size="sm" class="gap-1.5 px-4 font-semibold">
            <User class="size-3.5" />
            {{ currentUser.name.split(' ')[0] }}
          </UiButton>
        </NuxtLink>
        <NuxtLink v-else to="/auth/login">
          <UiButton variant="brand" size="sm" class="px-5 font-semibold">
            Log in
          </UiButton>
        </NuxtLink>
      </div>

      <!-- Mobile Sidebar Trigger (shadcn-vue Sheet) -->
      <div class="md:hidden">
        <UiSheet v-model:open="sidebarOpen">
          <UiSheetTrigger as-child>
            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-full transition-colors"
              :class="
                props.variant === 'solid'
                  ? 'border border-border bg-background text-foreground hover:bg-muted'
                  : 'bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
              "
              aria-label="Open navigation sidebar"
            >
              <Menu class="size-5" />
            </button>
          </UiSheetTrigger>

          <UiSheetContent side="right">
            <UiSheetHeader class="border-b border-border/70 pb-4">
              <div class="flex items-center gap-2.5">
                <span
                  class="flex size-9 items-center justify-center rounded-xl bg-brand-lime text-brand-lime-foreground"
                >
                  <Compass class="size-5" />
                </span>
                <div>
                  <UiSheetTitle>RokMerl</UiSheetTitle>
                  <UiSheetDescription>
                    Cambodia Smart Tourism
                  </UiSheetDescription>
                </div>
              </div>
            </UiSheetHeader>

            <!-- User Summary Pill (when signed in) -->
            <div v-if="currentUser" class="px-5 pt-2">
              <NuxtLink
                to="/profile"
                class="flex items-center gap-3 rounded-2xl bg-surface-sky/80 p-3 transition-colors hover:bg-surface-sky"
                @click="sidebarOpen = false"
              >
                <UiAvatar class="size-10 border border-white shadow-xs">
                  <UiAvatarImage
                    :src="currentUser.avatarUrl || '/icons/profile.png'"
                    :alt="currentUser.name"
                  />
                  <UiAvatarFallback>
                    {{ currentUser.name.slice(0, 2).toUpperCase() }}
                  </UiAvatarFallback>
                </UiAvatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-foreground">
                    {{ currentUser.name }}
                  </p>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ currentUser.email }}
                  </p>
                </div>
              </NuxtLink>
            </div>

            <!-- Sidebar Navigation Links -->
            <div class="flex-1 overflow-y-auto px-4 py-2">
              <p class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Navigation
              </p>
              <ul class="flex flex-col gap-1">
                <li v-for="link in navLinks" :key="link.to">
                  <NuxtLink
                    :to="link.to"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                    :class="
                      isActive(link.to)
                        ? 'bg-brand-lime font-semibold text-brand-lime-foreground shadow-2xs'
                        : 'text-foreground/85 hover:bg-muted'
                    "
                    @click="sidebarOpen = false"
                  >
                    <component :is="link.icon" class="size-4 shrink-0" />
                    <span>{{ link.label }}</span>
                  </NuxtLink>
                </li>
              </ul>

              <UiSeparator class="my-4" />

              <NuxtLink
                to="/profile"
                class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-muted"
                @click="sidebarOpen = false"
              >
                <span class="inline-flex items-center gap-3">
                  <Heart class="size-4 shrink-0" />
                  Saved Favorites
                </span>
                <UiBadge variant="secondary" class="px-2 py-0.5 text-[11px]">
                  {{ favoriteIds.length }}
                </UiBadge>
              </NuxtLink>

              <UiSeparator class="my-4" />

              <div class="px-2">
                <p class="mb-2 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Appearance
                </p>
                <CommonThemeToggle mode="segmented" />
              </div>
            </div>

            <!-- Sidebar Footer CTA -->
            <UiSheetFooter>
              <NuxtLink
                v-if="currentUser"
                to="/profile"
                class="w-full"
                @click="sidebarOpen = false"
              >
                <UiButton variant="brand" class="w-full font-semibold">
                  <User class="size-4" />
                  My Profile
                </UiButton>
              </NuxtLink>
              <template v-else>
                <NuxtLink
                  to="/auth/login"
                  class="w-full"
                  @click="sidebarOpen = false"
                >
                  <UiButton variant="brand" class="w-full font-semibold">
                    Log in
                  </UiButton>
                </NuxtLink>
                <NuxtLink
                  to="/auth/register"
                  class="w-full"
                  @click="sidebarOpen = false"
                >
                  <UiButton variant="outline" class="w-full font-medium">
                    Create Account
                  </UiButton>
                </NuxtLink>
              </template>
            </UiSheetFooter>
          </UiSheetContent>
        </UiSheet>
      </div>
    </nav>

    <!-- Floating Mobile Menu Button when scrolling past transparent hero -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-90 -translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-90 -translate-y-2"
      >
        <button
          v-if="props.variant === 'transparent' && isScrolled && !sidebarOpen"
          type="button"
          class="fixed top-4 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur-md transition-transform active:scale-95 md:hidden"
          aria-label="Open navigation sidebar"
          @click="sidebarOpen = true"
        >
          <Menu class="size-5" />
        </button>
      </Transition>
    </Teleport>
  </header>
</template>
