<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, Compass, Eye, EyeOff, Loader2 } from '@lucide/vue'

definePageMeta({
  alias: ['/login'],
})

useHead({
  title: 'Log in — RokMerl',
})

const { login, resolveRedirectPath, extractError } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

async function handleLogin() {
  if (isSubmitting.value) return

  errorMessage.value = ''
  fieldErrors.value = {}
  isSubmitting.value = true

  try {
    const response = await login({
      email: email.value,
      password: password.value,
    })
    await navigateTo(resolveRedirectPath(response.data))
  } catch (err) {
    const parsed = extractError(err)
    errorMessage.value = parsed.message
    fieldErrors.value = parsed.fieldErrors
  } finally {
    isSubmitting.value = false
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
              Sign in with your email and password to continue to RokMerl.
            </UiCardDescription>
          </UiCardHeader>

          <UiCardContent>
            <!-- Error Alert -->
            <div
              v-if="errorMessage"
              role="alert"
              class="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs font-medium text-destructive"
            >
              <AlertCircle class="mt-0.5 size-4 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <form class="space-y-4" @submit.prevent="handleLogin">
              <div class="space-y-1.5">
                <UiLabel for="login-email">Email Address</UiLabel>
                <UiInput
                  id="login-email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  :disabled="isSubmitting"
                  placeholder="test@three.com"
                />
                <p v-if="fieldErrors.email" class="text-xs text-destructive">
                  {{ fieldErrors.email }}
                </p>
              </div>

              <div class="space-y-1.5">
                <UiLabel for="login-password">Password</UiLabel>
                <div class="relative">
                  <UiInput
                    id="login-password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    :disabled="isSubmitting"
                    placeholder="Enter your password"
                    class="pr-10"
                  />
                  <button
                    type="button"
                    class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff v-if="showPassword" class="size-4" />
                    <Eye v-else class="size-4" />
                  </button>
                </div>
                <p v-if="fieldErrors.password" class="text-xs text-destructive">
                  {{ fieldErrors.password }}
                </p>
              </div>

              <UiButton
                type="submit"
                variant="brand"
                size="lg"
                class="w-full font-semibold"
                :disabled="isSubmitting"
              >
                <Loader2 v-if="isSubmitting" class="size-4 animate-spin" />
                {{ isSubmitting ? 'Signing in...' : 'Log in' }}
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
