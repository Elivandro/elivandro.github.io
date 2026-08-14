<template>
    <RouterView v-if="isFullscreen" />

    <template v-else>
        <AppHeader />

        <main class="relative max-w-6xl mx-auto text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            <RouterView />
        </main>

        <AppFooter />
    </template>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()

const isFullscreen = computed(() => route.meta.fullscreen === true)
</script>