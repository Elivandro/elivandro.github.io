<template>
    <header class="fixed z-50 flex flex-wrap w-full py-4 text-sm bg-white shadow-md sm:justify-start sm:flex-nowrap">
        <nav class="w-full max-w-6xl px-4 mx-auto sm:flex sm:items-center sm:justify-between" aria-label="Global">
            <div class="flex items-center justify-between">
                <a class="inline-flex items-center text-xl font-semibold gap-x-2" href="#home">
                    <img class="w-20 h-20" src="../../assets/logo.svg" alt="Elivandro" />
                            <span class="max-w-[90px]">Elivandro WebDev</span>
                </a>
                <div class="sm:hidden">
                    <button type="button" @click="handleMenu()" class="inline-flex items-center justify-center gap-2 p-2 text-sm font-medium text-gray-700 align-middle transition-all bg-white border rounded-md shadow-sm hs-collapse-toggle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600" data-hs-collapse="#navbar-image-and-text-2" aria-controls="navbar-image-and-text-2" aria-label="Toggle navigation">
                        <svg class="w-4 h-4 hs-collapse-open:hidden" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        <svg class="hidden w-4 h-4 hs-collapse-open:block" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="nav" class="hidden overflow-hidden transition-all duration-300 hs-collapse basis-full grow sm:block">
                <ul id="ul" class="flex flex-col gap-5 mt-5 uppercase sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                    <li>
                        <NavLink link="#home" title="Inicio" aria-current="page" />
                    </li>
                    <li>
                        <NavLink link="#about" title="Sobre" />
                    </li>
                    <li>
                        <NavLink link="#projects" title="Projetos" />
                    </li>
                    <li>
                        <NavLink link="#experience" title="Experiência" />
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>
<script>
    /* eslint-disable */
    import NavLink from "@/components/partials/NavLink.vue";

    export default {
    name: 'Header',
    methods: {
        handleMenu() {
            const nav = document.getElementById('nav');
            const ul = document.getElementById('ul');
            if (nav.classList.contains('hidden')) {
                nav.classList.remove('hidden');
                ul.classList.remove('hidden');
            }
            else {
                nav.classList.add('hidden');
            }
        }
    },
    components: { NavLink }
}
</script>