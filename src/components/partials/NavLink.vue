<template>
    <a :href="link" :title="title" :target="target" class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-200 dark:hover:text-gray-400">
        {{ title }}
    </a>
</template>

<script>
    export default {
        name: 'NavLink',
        props: {
            title: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
            target: {
                type: String,
                required: false,
            }
        }
    }
</script>