<template>
  <h1>Welcome to Inertia.js</h1>
  <pre>{{ props }}</pre>
  <Link href="/page">Go here</Link>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
const props = defineProps({
  user: Object,
})
</script>