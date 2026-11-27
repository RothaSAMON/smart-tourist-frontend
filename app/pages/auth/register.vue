<script setup lang="ts">
import { ref } from 'vue'
import type { UserRole } from '@/types/tourism'

definePageMeta({
  alias: ['/register'],
})

useHead({
  title: 'Register — RokMerl',
})

const store = useTourismStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<Extract<UserRole, 'tourist' | 'business'>>('tourist')

async function handleRegister() {
  store.loginMock(
    name.value || 'New Traveler',
    email.value || 'traveler@rokmerl.kh',
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
            Join RokMerl
          </UiBadge>
          <UiCardTitle class="mt-2 text-2xl">Create your account</UiCardTitle>
          <UiCardDescription>
            Register as a Tourist to build AI trips or as a Business Owner to list your local service.
          </UiCardDescription>
        </UiCardHeader>

        <UiCardContent>
          <form class="space-y-4" @submit.prevent="handleRegister">
            <div class="space-y-1.5">
              <UiLabel>Register As</UiLabel>
              <UiTabs v-model="role">
                <UiTabsList class="grid w-full grid-cols-2">
                  <UiTabsTrigger value="tourist">Tourist</UiTabsTrigger>
                  <UiTabsTrigger value="business">Business Owner</UiTabsTrigger>
                </UiTabsList>
              </UiTabs>
              <p class="text-[11px] text-muted-foreground">
                {{
                  role === 'tourist'
                    ? 'Explore attractions, save favorites, and build personalized AI itineraries.'
                    : 'List your restaurant, hotel, cafe, homestay, tour guide, or transport service.'
                }}
              </p>
            </div>

            <div class="space-y-1.5">
              <UiLabel for="reg-name">Full Name</UiLabel>
              <UiInput id="reg-name" v-model="name" required placeholder="e.g. Dara Chan" />
            </div>

            <div class="space-y-1.5">
              <UiLabel for="reg-email">Email Address</UiLabel>
              <UiInput
                id="reg-email"
                v-model="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div class="space-y-1.5">
              <UiLabel for="reg-password">Password</UiLabel>
              <UiInput
                id="reg-password"
                v-model="password"
                type="password"
                required
                placeholder="Create a password"
              />
            </div>

            <UiButton type="submit" variant="brand" size="lg" class="w-full font-semibold">
              Create Account
            </UiButton>
          </form>

          <UiSeparator class="my-5" />

          <p class="text-center text-xs text-muted-foreground">
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
