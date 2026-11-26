<script setup lang="ts">
import { ref } from 'vue'
import { Compass, Heart, Menu, Sparkles, User, X } from '@lucide/vue'

interface Props {
  variant?: 'transparent' | 'solid'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'transparent',
})

const route = useRoute()
const { currentUser, favoriteIds } = useTourismStore()

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'AI Planner', to: '/planner' },
  { label: 'Business', to: '/business' },
  { label: 'Admin', to: '/admin' },
]

const mobileMenuOpen = ref(false)

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
        ? 'sticky top-0 border-b border-border/80 bg-white/90 backdrop-blur-md'
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

      <!-- Right Actions -->
      <div class="hidden items-center gap-2.5 md:flex">
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

      <!-- Mobile Menu Toggle -->
      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-full md:hidden"
        :class="
          props.variant === 'solid'
            ? 'border border-border bg-background text-foreground'
            : 'bg-white/15 text-white backdrop-blur-md'
        "
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <X v-if="mobileMenuOpen" class="size-5" />
        <Menu v-else class="size-5" />
      </button>
    </nav>

    <!-- Mobile Dropdown -->
    <div
      v-if="mobileMenuOpen"
      class="mx-4 mb-3 rounded-2xl border p-5 backdrop-blur-lg md:hidden"
      :class="
        props.variant === 'solid'
          ? 'border-border bg-white text-foreground shadow-lg'
          : 'border-white/20 bg-neutral-950/90 text-white'
      "
    >
      <ul class="flex flex-col gap-2">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="
              props.variant === 'solid'
                ? 'hover:bg-muted'
                : 'text-white/90 hover:bg-white/10'
            "
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-4 flex items-center gap-2.5 border-t border-border/30 pt-4">
        <NuxtLink to="/profile" class="flex-1" @click="mobileMenuOpen = false">
          <UiButton variant="outline" class="w-full font-medium">
            My Profile ({{ favoriteIds.length }})
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/auth/login" class="flex-1" @click="mobileMenuOpen = false">
          <UiButton variant="brand" class="w-full font-semibold">
            Log in
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
