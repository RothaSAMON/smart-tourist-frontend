<script setup lang="ts">
import { ref } from 'vue'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from '@lucide/vue'
import { UserType, type RegisterUserType } from '@/enums/role'

definePageMeta({
  alias: ['/register'],
})

useHead({
  title: 'Register — RokMerl',
})

const { register, resolveRedirectPath, extractError } = useAuth()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const userType = ref<RegisterUserType>(UserType.USER)

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const pendingMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

async function handleRegister() {
  if (isSubmitting.value) return

  errorMessage.value = ''
  pendingMessage.value = ''
  fieldErrors.value = {}

  if (password.value !== passwordConfirmation.value) {
    fieldErrors.value.password_confirmation = 'Passwords do not match.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await register({
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      user_type: userType.value,
    })

    if (response.data?.status?.toLowerCase() === 'pending') {
      pendingMessage.value =
        response.message ||
        'Register Successfully. Your account is pending admin approval.'
      return
    }

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
          <!-- Pending Approval Success State (Business Owner) -->
          <div
            v-if="pendingMessage"
            class="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"
          >
            <div class="flex items-start gap-3">
              <CheckCircle2 class="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <p class="text-sm font-bold">Registration Submitted</p>
                <p class="mt-1 text-xs leading-relaxed text-emerald-800">
                  {{ pendingMessage }}
                </p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <NuxtLink to="/profile">
                <UiButton variant="brand" size="sm" class="font-semibold">
                  View My Profile
                </UiButton>
              </NuxtLink>
              <NuxtLink to="/">
                <UiButton variant="outline" size="sm">
                  Back to Home
                </UiButton>
              </NuxtLink>
            </div>
          </div>

          <form v-else class="space-y-4" @submit.prevent="handleRegister">
            <!-- Error Alert -->
            <div
              v-if="errorMessage"
              role="alert"
              class="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs font-medium text-destructive"
            >
              <AlertCircle class="mt-0.5 size-4 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Role Tabs -->
            <div class="space-y-1.5">
              <UiLabel>Register As</UiLabel>
              <UiTabs v-model="userType">
                <UiTabsList class="grid w-full grid-cols-2">
                  <UiTabsTrigger :value="UserType.USER">Tourist</UiTabsTrigger>
                  <UiTabsTrigger :value="UserType.BUSINESS_OWNER">
                    Business Owner
                  </UiTabsTrigger>
                </UiTabsList>
              </UiTabs>
              <p class="text-[11px] text-muted-foreground">
                {{
                  userType === UserType.USER
                    ? 'Explore attractions, save favorites, and build personalized AI itineraries.'
                    : 'Business owner accounts start as pending until approved by a RokMerl administrator.'
                }}
              </p>
              <p v-if="fieldErrors.user_type" class="text-xs text-destructive">
                {{ fieldErrors.user_type }}
              </p>
            </div>

            <!-- Full Name -->
            <div class="space-y-1.5">
              <UiLabel for="reg-name">Full Name</UiLabel>
              <UiInput
                id="reg-name"
                v-model="name"
                autocomplete="name"
                required
                :disabled="isSubmitting"
                placeholder="e.g. Business Two"
              />
              <p v-if="fieldErrors.name" class="text-xs text-destructive">
                {{ fieldErrors.name }}
              </p>
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <UiLabel for="reg-email">Email Address</UiLabel>
              <UiInput
                id="reg-email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isSubmitting"
                placeholder="you@example.com"
              />
              <p v-if="fieldErrors.email" class="text-xs text-destructive">
                {{ fieldErrors.email }}
              </p>
            </div>

            <!-- Phone -->
            <div class="space-y-1.5">
              <UiLabel for="reg-phone">Phone Number</UiLabel>
              <UiInput
                id="reg-phone"
                v-model="phone"
                type="tel"
                autocomplete="tel"
                required
                :disabled="isSubmitting"
                placeholder="+855 12 345 678"
              />
              <p v-if="fieldErrors.phone" class="text-xs text-destructive">
                {{ fieldErrors.phone }}
              </p>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <UiLabel for="reg-password">Password</UiLabel>
              <div class="relative">
                <UiInput
                  id="reg-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  :disabled="isSubmitting"
                  placeholder="Create a password"
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

            <!-- Confirm Password -->
            <div class="space-y-1.5">
              <UiLabel for="reg-password-confirm">Confirm Password</UiLabel>
              <div class="relative">
                <UiInput
                  id="reg-password-confirm"
                  v-model="passwordConfirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  :disabled="isSubmitting"
                  placeholder="Re-enter your password"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  :aria-label="
                    showPasswordConfirmation
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  "
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                >
                  <EyeOff v-if="showPasswordConfirmation" class="size-4" />
                  <Eye v-else class="size-4" />
                </button>
              </div>
              <p
                v-if="fieldErrors.password_confirmation"
                class="text-xs text-destructive"
              >
                {{ fieldErrors.password_confirmation }}
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
              {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
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
