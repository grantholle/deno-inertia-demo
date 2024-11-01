<template>
  <div class="flex flex-col min-h-screen px-4">
    <main class="flex-1 py-20">
      <div class="rounded-xl bg-white/30 backdrop-blur-sm max-w-5xl mx-auto px-6 py-5 shadow-lg">
        <slot />
      </div>
    </main>

    <!--<footer class="py-8 text-center text-sm text-white">-->
    <!--  {{ props.user.id }}-->
    <!--</footer>-->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

const props = computed(() => usePage().props)
</script>

