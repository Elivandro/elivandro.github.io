<template>
    <footer class="mt-4 bg-gray-200 rounded-lg shadow dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center w-full max-w-6xl p-8 mx-auto">
            <span class="text-sm text-gray-500 sm:text-center">
                © {{ year }} <NavLink link="https://api.whatsapp.com/send?phone=5569999076818" target="blank" class="hover:underline" title="Elivandro" />
            </span>
            <span class="text-sm text-gray-500 sm:text-center">
                Todos os direitos reservados.
            </span>
        </div>
    </footer>
</template>

<script>
    /* eslint-disable */
    import NavLink from "@/components/partials/NavLink.vue";

    export default {
        name: "Footer",
        data(){
            return {
                year: new Date().getFullYear()
            }
        },
        components: { NavLink }
    }
</script>