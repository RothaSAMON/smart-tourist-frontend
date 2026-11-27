import type { InjectionKey, Ref } from 'vue'
import { inject, onMounted, onUnmounted, provide, ref } from 'vue'

export interface CarouselContext {
  viewportRef: Ref<HTMLElement | null>
  currentIndex: Ref<number>
  slideCount: Ref<number>
  canScrollPrev: Ref<boolean>
  canScrollNext: Ref<boolean>
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  syncState: () => void
}

const CAROUSEL_KEY: InjectionKey<CarouselContext> = Symbol('shadcn-carousel')

export function useProvideCarousel(opts?: { loop?: boolean }) {
  const viewportRef = ref<HTMLElement | null>(null)
  const currentIndex = ref(0)
  const slideCount = ref(0)
  const canScrollPrev = ref(false)
  const canScrollNext = ref(false)

  function syncState() {
    const el = viewportRef.value
    if (!el) return
    const items = el.querySelectorAll('[data-slot="carousel-item"]')
    slideCount.value = items.length

    if (items.length === 0 || el.clientWidth === 0) {
      currentIndex.value = 0
      canScrollPrev.value = false
      canScrollNext.value = false
      return
    }

    const idx = Math.round(el.scrollLeft / el.clientWidth)
    currentIndex.value = Math.max(0, Math.min(idx, items.length - 1))
    canScrollPrev.value = opts?.loop ? items.length > 1 : currentIndex.value > 0
    canScrollNext.value = opts?.loop
      ? items.length > 1
      : currentIndex.value < items.length - 1
  }

  function scrollTo(index: number) {
    const el = viewportRef.value
    if (!el || slideCount.value === 0) return
    const clamped = opts?.loop
      ? (index + slideCount.value) % slideCount.value
      : Math.max(0, Math.min(index, slideCount.value - 1))

    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: 'smooth',
    })
    currentIndex.value = clamped
    canScrollPrev.value = opts?.loop ? slideCount.value > 1 : clamped > 0
    canScrollNext.value = opts?.loop
      ? slideCount.value > 1
      : clamped < slideCount.value - 1
  }

  function scrollPrev() {
    scrollTo(currentIndex.value - 1)
  }

  function scrollNext() {
    scrollTo(currentIndex.value + 1)
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    const el = viewportRef.value
    if (!el) return
    el.addEventListener('scroll', syncState, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncState)
      resizeObserver.observe(el)
    }
    syncState()
  })

  onUnmounted(() => {
    viewportRef.value?.removeEventListener('scroll', syncState)
    resizeObserver?.disconnect()
  })

  const ctx: CarouselContext = {
    viewportRef,
    currentIndex,
    slideCount,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
    syncState,
  }

  provide(CAROUSEL_KEY, ctx)
  return ctx
}

export function useCarousel() {
  const ctx = inject(CAROUSEL_KEY)
  if (!ctx) {
    throw new Error('useCarousel must be used within a <UiCarousel />')
  }
  return ctx
}
