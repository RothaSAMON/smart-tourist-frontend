<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight, Star } from '@lucide/vue'
import { CUSTOMER_TESTIMONIALS } from '@/data/home'

const activeIndex = ref(2)

const activeTestimonial = computed(() => {
  return CUSTOMER_TESTIMONIALS[activeIndex.value] ?? CUSTOMER_TESTIMONIALS[0]!
})

function prev() {
  activeIndex.value =
    (activeIndex.value - 1 + CUSTOMER_TESTIMONIALS.length) %
    CUSTOMER_TESTIMONIALS.length
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % CUSTOMER_TESTIMONIALS.length
}
</script>

<template>
  <section id="testimonials" class="py-6 sm:py-10">
    <div
      class="relative overflow-hidden rounded-3xl bg-brand-lime px-6 py-14 text-brand-lime-foreground sm:px-12 sm:py-20"
    >
      <!-- Subtle Decorative Line Art -->
      <svg
        class="pointer-events-none absolute -top-10 -left-16 h-64 w-64 text-black/10"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 190 C 40 120, 90 90, 180 10"
          stroke="currentColor"
          stroke-width="1.2"
        />
      </svg>
      <svg
        class="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 text-black/10"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 180 C 90 150, 140 90, 190 20"
          stroke="currentColor"
          stroke-width="1.2"
        />
      </svg>

      <div class="relative z-10 mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          What Our Customers Say
        </h2>
        <p class="mt-2.5 text-sm text-brand-lime-foreground/75 sm:text-base">
          See why our travelers choose SmartTour for unforgettable travel experiences.
        </p>

        <!-- Quote -->
        <blockquote
          class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed font-semibold tracking-tight sm:mt-10 sm:text-2xl"
        >
          {{ activeTestimonial.quote }}
        </blockquote>

        <!-- Avatar Switcher Carousel -->
        <div class="mt-9 flex items-center justify-center gap-3 sm:gap-5">
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-full border border-brand-lime-foreground/25 text-brand-lime-foreground transition-colors hover:bg-black/10"
            aria-label="Previous testimonial"
            @click="prev"
          >
            <ChevronLeft class="size-4" />
          </button>

          <div class="flex items-center gap-2.5 sm:gap-3.5">
            <button
              v-for="(item, index) in CUSTOMER_TESTIMONIALS"
              :key="item.id"
              type="button"
              :aria-label="`Read review by ${item.name}`"
              :aria-pressed="index === activeIndex"
              class="rounded-full transition-all duration-200"
              :class="
                index === activeIndex
                  ? 'scale-115 ring-3 ring-white shadow-md'
                  : 'opacity-70 hover:opacity-100'
              "
              @click="activeIndex = index"
            >
              <UiAvatar
                :class="index === activeIndex ? 'size-12 sm:size-14' : 'size-9 sm:size-10'"
              >
                <UiAvatarImage :src="item.avatarUrl" :alt="item.name" />
                <UiAvatarFallback>{{ item.name.slice(0, 2) }}</UiAvatarFallback>
              </UiAvatar>
            </button>
          </div>

          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-full border border-brand-lime-foreground/25 text-brand-lime-foreground transition-colors hover:bg-black/10"
            aria-label="Next testimonial"
            @click="next"
          >
            <ChevronRight class="size-4" />
          </button>
        </div>

        <!-- Active Reviewer Info -->
        <div class="mt-5">
          <p class="text-sm font-bold">{{ activeTestimonial.name }}</p>
          <p class="text-xs text-brand-lime-foreground/70">
            {{ activeTestimonial.location }}
          </p>
          <div
            class="mt-2 flex items-center justify-center gap-0.5"
            :aria-label="`${activeTestimonial.rating} out of 5 stars`"
          >
            <Star
              v-for="n in activeTestimonial.rating"
              :key="n"
              class="size-3.5 fill-brand-lime-foreground text-brand-lime-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
