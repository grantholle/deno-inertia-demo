<template>
  <h1 class="text-2xl mb-2 font-medium">Inertia State</h1>
  <pre class="bg-black rounded-md p-4 text-white mb-2">{{ props }}</pre>
  <Link href="/page" class="inline-flex px-2 py-1 rounded bg-white">
    Visit a page
  </Link>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
import Layout from "../Layout.vue";

const props = defineProps({
  user: Object,
})
defineOptions({ layout: Layout })
</script>
