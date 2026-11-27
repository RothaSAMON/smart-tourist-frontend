<script setup lang="ts">
import { ref } from 'vue'
import { Compass } from '@lucide/vue'
import type { UserRole } from '@/types/tourism'

definePageMeta({
  alias: ['/login'],
})

useHead({
  title: 'Log in — RokMerl',
})

const store = useTourismStore()

const email = ref('sophea@rokmerl.kh')
const password = ref('••••••••')
const role = ref<UserRole>('tourist')

async function handleLogin() {
  const defaultNames: Record<UserRole, string> = {
    tourist: 'Sophea Kem',
    business: 'Vanna Sok',
    admin: 'Admin RokMerl',
  }
  store.loginMock(defaultNames[role.value], email.value, role.value)
  if (role.value === 'business') {
    await navigateTo('/business')
  } else if (role.value === 'admin') {
    await navigateTo('/admin')
  } else {
    await navigateTo('/profile')
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:items-center">
      <!-- Visual Side -->
      <div class="relative hidden overflow-hidden rounded-3xl bg-neutral-900 lg:col-span-6 lg:block">
        <img
          src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80"
          alt="Angkor Wat Cambodia"
          class="h-[520px] w-full object-cover opacity-85"
        />
        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8 text-white">
          <UiBadge variant="brand" class="w-fit font-bold">
            <Compass class="size-3.5" />
            RokMerl
          </UiBadge>
          <h2 class="mt-3 text-2xl font-bold leading-snug">
            Save favorites, build AI itineraries, or manage your local tourism business.
          </h2>
        </div>
      </div>

      <!-- Form Side -->
      <div class="lg:col-span-6">
        <UiCard class="p-2 sm:p-4">
          <UiCardHeader>
            <UiCardTitle class="text-2xl">Welcome back</UiCardTitle>
            <UiCardDescription>
              Sign in to your RokMerl account (demo mode — ready for Laravel API)
            </UiCardDescription>
          </UiCardHeader>

          <UiCardContent>
            <form class="space-y-4" @submit.prevent="handleLogin">
              <!-- Demo Role Switcher with shadcn-vue Tabs -->
              <div class="space-y-1.5">
                <UiLabel>Account Type</UiLabel>
                <UiTabs v-model="role">
                  <UiTabsList class="grid w-full grid-cols-3">
                    <UiTabsTrigger value="tourist">Tourist</UiTabsTrigger>
                    <UiTabsTrigger value="business">Business</UiTabsTrigger>
                    <UiTabsTrigger value="admin">Admin</UiTabsTrigger>
                  </UiTabsList>
                </UiTabs>
              </div>

              <div class="space-y-1.5">
                <UiLabel for="login-email">Email Address</UiLabel>
                <UiInput
                  id="login-email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div class="space-y-1.5">
                <UiLabel for="login-password">Password</UiLabel>
                <UiInput
                  id="login-password"
                  v-model="password"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>

              <UiButton type="submit" variant="brand" size="lg" class="w-full font-semibold">
                Log in as {{ role }}
              </UiButton>
            </form>

            <UiSeparator class="my-5" />

            <p class="text-center text-xs text-muted-foreground">
              New to RokMerl?
              <NuxtLink to="/auth/register" class="font-semibold text-foreground underline underline-offset-4">
                Create an account
              </NuxtLink>
            </p>
          </UiCardContent>
        </UiCard>
      </div>
    </main>
  </div>
</template>
