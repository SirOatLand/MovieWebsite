<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <Navbar/>
    <router-view></router-view>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
</script>


<style scoped>
</style>