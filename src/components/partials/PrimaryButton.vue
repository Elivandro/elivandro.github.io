<template>
    <button class="inline-flex items-center justify-center px-4 py-2 text-base font-medium text-gray-200 transition-colors bg-gray-800 rounded-lg select-none dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-eval-2 hover:bg-gray-600 focus:ring-slate-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:hover:text-white" :disabled="disabled">
        {{ title }}
    </button>
</template>

<script>
    export default {
        name: "PrimaryButton",
        props: {
            title: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>