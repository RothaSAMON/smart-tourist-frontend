import { computed, onMounted, onUnmounted, watch } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'

export function useTheme() {
  const preference = useCookie<ThemePreference>('theme', {
    sameSite: 'lax',
    default: () => 'system',
  })

  const systemDark = useState<boolean>('theme-system-dark', () => false)

  const resolvedTheme = computed<'light' | 'dark'>(() => {
    if (preference.value === 'system') {
      return systemDark.value ? 'dark' : 'light'
    }
    return preference.value
  })

  function applyDomTheme() {
    if (!import.meta.client) return
    const isDark = resolvedTheme.value === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }

  function setTheme(next: ThemePreference) {
    preference.value = next
    applyDomTheme()
  }

  let mediaQuery: MediaQueryList | null = null
  const handleMediaChange = (event: MediaQueryListEvent) => {
    systemDark.value = event.matches
    applyDomTheme()
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mediaQuery.matches
    mediaQuery.addEventListener('change', handleMediaChange)
    applyDomTheme()
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', handleMediaChange)
  })

  watch([preference, systemDark], applyDomTheme)

  return {
    preference,
    resolvedTheme,
    setTheme,
  }
}
