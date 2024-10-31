<template>
  <h1 class="text-2xl mb-2 font-medium">Other Page</h1>
  <pre class="bg-black rounded-md p-4 text-white mb-2">{{ props }}</pre>

<div class="flex items-center gap-2">
  <Link href="/" class="inline-flex px-2 py-1 rounded bg-white">
    Back to index
  </Link>
  <Link href="/page" :only="['value']" class="inline-flex px-2 py-1 rounded bg-white">
    Reload value
  </Link>
  <Link href="/page" :except="['value']" class="inline-flex px-2 py-1 rounded bg-white">
    Exclude value
  </Link>
</div>
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