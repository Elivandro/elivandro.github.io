<template>

    <AppHeader />

    <main class="relative max-w-6xl mx-auto text-gray-800 dark:text-gray-200 dark:bg-gray-800">

        <RouterView />

    </main>

    <AppFooter />

</template>

<script setup>
    import { RouterView } from 'vue-router';
    import AppHeader from '@/components/layout/AppHeader.vue';
    import AppFooter from '@/components/layout/AppFooter.vue';
</script>
