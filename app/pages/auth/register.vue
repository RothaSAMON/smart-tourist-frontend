<script setup lang="ts">
import { ref } from 'vue'
import type { UserRole } from '@/types/tourism'

useHead({
  title: 'Register — SmartTour Cambodia',
})

const store = useTourismStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<Extract<UserRole, 'tourist' | 'business'>>('tourist')

async function handleRegister() {
  store.loginMock(
    name.value || 'New Traveler',
    email.value || 'traveler@smarttour.kh',
    role.value,
  )
  await navigateTo(role.value === 'business' ? '/business' : '/profile')
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppNavbar variant="solid" />

    <main class="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <UiCard class="p-2 sm:p-4">
        <UiCardHeader>
          <UiBadge variant="brand" class="w-fit font-semibold">
            Join SmartTour Cambodia
          </UiBadge>
          <UiCardTitle class="mt-2 text-2xl">Create your account</UiCardTitle>
          <UiCardDescription>
            Register as a Tourist to build AI trips or as a Business Owner to list your local service.
          </UiCardDescription>
        </UiCardHeader>

        <UiCardContent>
          <form class="space-y-4" @submit.prevent="handleRegister">
            <div class="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                class="rounded-xl border px-3 py-2.5 text-left transition-colors"
                :class="
                  role === 'tourist'
                    ? 'border-transparent bg-brand-lime text-brand-lime-foreground'
                    : 'border-border hover:bg-muted'
                "
                @click="role = 'tourist'"
              >
                <p class="text-xs font-bold">Tourist</p>
                <p class="text-[11px] opacity-80">Explore, save &amp; plan trips</p>
              </button>
              <button
                type="button"
                class="rounded-xl border px-3 py-2.5 text-left transition-colors"
                :class="
                  role === 'business'
                    ? 'border-transparent bg-brand-lime text-brand-lime-foreground'
                    : 'border-border hover:bg-muted'
                "
                @click="role = 'business'"
              >
                <p class="text-xs font-bold">Business Owner</p>
                <p class="text-[11px] opacity-80">Hotels, food, tours &amp; transport</p>
              </button>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Full Name
              </label>
              <UiInput v-model="name" required placeholder="e.g. Dara Chan" />
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
              <UiInput v-model="password" type="password" required placeholder="Create a password" />
            </div>

            <UiButton type="submit" variant="brand" size="lg" class="w-full font-semibold">
              Create Account
            </UiButton>
          </form>

          <p class="mt-5 text-center text-xs text-muted-foreground">
            Already have an account?
            <NuxtLink to="/auth/login" class="font-semibold text-foreground underline underline-offset-4">
              Log in
            </NuxtLink>
          </p>
        </UiCardContent>
      </UiCard>
    </main>
  </div>
</template>
