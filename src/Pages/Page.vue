<template>
  <h1>Another Inertia Page</h1>
  <pre>{{ props }}</pre>
  <Link href="/">Go here</Link>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
const props = defineProps({
  value: String,
  user: Object,
})
</script>