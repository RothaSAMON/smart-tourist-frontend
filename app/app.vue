<script setup lang="ts">
const { preference } = useTheme()

useHead({
  htmlAttrs: {
    class: computed(() => (preference.value === 'dark' ? 'dark' : '')),
  },
  script: [
    {
      innerHTML: `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
      tagPosition: 'head',
    },
  ],
})
</script>

<template>
  <NuxtPage />
</template>
