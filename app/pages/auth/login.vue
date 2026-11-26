<script setup lang="ts">
import { ref } from 'vue'
import { Compass } from '@lucide/vue'
import type { UserRole } from '@/types/tourism'

useHead({
  title: 'Log in — SmartTour Cambodia',
})

const store = useTourismStore()

const email = ref('sophea@smarttour.kh')
const password = ref('••••••••')
const role = ref<UserRole>('tourist')

async function handleLogin() {
  const defaultNames: Record<UserRole, string> = {
    tourist: 'Sophea Kem',
    business: 'Vanna Sok',
    admin: 'Admin SmartTour',
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
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8 flex flex-col justify-end text-white">
          <span class="inline-flex w-fit items-center gap-2 rounded-full bg-brand-lime px-3 py-1 text-xs font-bold text-brand-lime-foreground">
            <Compass class="size-3.5" />
            SmartTour Cambodia
          </span>
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
              Sign in to your SmartTour Cambodia account (demo mode — ready for Laravel API)
            </UiCardDescription>
          </UiCardHeader>

          <UiCardContent>
            <form class="space-y-4" @submit.prevent="handleLogin">
              <!-- Demo Role Switcher -->
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Account Type
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="item in [
                      { id: 'tourist', label: 'Tourist' },
                      { id: 'business', label: 'Business' },
                      { id: 'admin', label: 'Admin' },
                    ]"
                    :key="item.id"
                    type="button"
                    class="rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
                    :class="
                      role === item.id
                        ? 'border-transparent bg-brand-lime text-brand-lime-foreground'
                        : 'border-border bg-background hover:bg-muted'
                    "
                    @click="role = item.id as UserRole"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Email Address
                </label>
                <UiInput v-model="email" type="email" required placeholder="you@example.com" />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Password
                </label>
                <UiInput v-model="password" type="password" required placeholder="••••••••" />
              </div>

              <UiButton type="submit" variant="brand" size="lg" class="w-full font-semibold">
                Log in as {{ role }}
              </UiButton>
            </form>

            <p class="mt-5 text-center text-xs text-muted-foreground">
              New to SmartTour Cambodia?
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
