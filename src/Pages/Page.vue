<template>
  <h1 class="text-2xl mb-2 font-medium">Other Page</h1>
  <pre class="bg-black rounded-md p-4 text-white mb-2">{{ props }}</pre>
  <Link href="/" class="inline-flex px-2 py-1 rounded bg-white">
    Back to index
  </Link>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
import Layout from "../Layout.vue";

const props = defineProps({
  value: String,
  user: Object,
})
defineOptions({ layout: Layout })
</script>