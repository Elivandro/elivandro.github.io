<template>
    <button class="inline-flex items-center justify-center px-4 py-2 text-base font-medium text-white transition-colors rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-eval-2 hover:bg-slate-600 focus:ring-slate-500 bg-slate-800" :disabled="disabled">
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