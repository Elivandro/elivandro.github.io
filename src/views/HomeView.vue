<template>
    <section class="h-screen" id="home">
        <div class="flex items-center pt-48 mx-4 justify-evenly">
            <div class="flex flex-col items-center">
                <div class="p-8 text-xl text-left">
                    <p>Olá,</p>
                    <p class="text-4xl font-bold uppercase max-w-[280px]">eu sou programador</p>
                    <p>Seja bem vindo ao meu portfólio.</p>
                </div>

                <NavLink link="#about" title="Saber mais" class="inline-flex items-center justify-center px-4 py-2 text-base font-medium text-white transition-colors bg-gray-800 rounded-lg select-none hover:text-gray-200 dark:hover:text-gray-100 dark:text-gray-800 dark:bg-gray-200 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-eval-2 hover:bg-gray-600 dark:hover:bg-gray-600 focus:ring-slate-500" />

                <ul class="flex items-end justify-center space-x-4 space-y-16" id="socialmedia-icons">
                    <li class="transition-transform duration-300 transform scale-95 dark:shadown-none hover:scale-105">
                        <a href="https://www.linkedin.com/in/elivandroeas/" target="_blank" title="Linkedin">
                            <!-- LinkedIn svg -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 48 48">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z" />
                                <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z" />
                            </svg>
                        </a>
                    </li>
                    <li class="transition-transform duration-300 transform scale-95 dark:shadown-none hover:scale-105">
                        <a href="https://github.com/Elivandro" target="_blank" title="Github">
                            <!-- Github svg -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 rounded-full dark:bg-gray-200" viewBox="0 0 64 64">
                                <path d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z" />
                            </svg>
                        </a>
                    </li>
                    <li class="transition-transform duration-300 transform scale-95 dark:shadown-none hover:scale-105">
                        <a href="https://api.whatsapp.com/send?phone=5569999076818" target="_blank" title="Whatsapp">
                            <!-- Whatsapp svg -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 48 48">
                                <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24 c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z" />
                                <path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6 C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3 L5,43.8C5,43.8,4.9,43.8,4.9,43.8z" />
                                <path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3 l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24 c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2 c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z" />
                                <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3	c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z" />
                                <path fill="#fff" fill-rule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4 s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6 s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4 c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8 C20.6,19.3,19.7,17,19.3,16z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
            <figure class="hidden h-full max-w-xl p-5 shrink md:flex">
                <img src="../assets/images/ilustrations/working.svg" alt="working at a computer" />
            </figure>
        </div>
    </section>

    <section id="about" class="mx-2 space-y-4 pt-36">
        <div class="flex flex-col items-center justify-center dark:text-gray-400">
            <figure class="object-cover object-center text-center espace-y-12">
                <img src="../assets/images/profile/profile.jpeg" width="160" height="160" class="border-2 rounded-full shadow-lg border-slate-800 outline-slate-800 outline-2" alt="imagem de Elivandro" />
                <figcaption class="py-2">
                    <p class="text-2xl dark:text-gray-200">Elivandro Silva</p>
                </figcaption>
            </figure>
            <p class="max-w-xl text-lg text-center">
                Meu nome é Elivandro de Aguiar Silva, moro em Pimenta Bueno, RO - Brasil.
                Sou desenvolvedor fullstack, já consumi api's em projetos laravel, possuo experiência de trabalho em grupo e atualmente venho atuando em projetos pessoais alguns meus ou de outrem. Ver a aplicação em funcionamento é minha maior paixão.
            </p>
        </div>
        <div class="flex flex-col items-center flex-auto pt-8">
            <TechCards />
        </div>
    </section>

    <section id="projects" class="mx-4 space-y-4 py-36">
        <div class="flex items-center justify-center">
            <div class="flex flex-col">
                <div class="flex items-end gap-8 text-left">
                    <h2 class="max-w-[120px] text-3xl">Meus projetos</h2>
                    <p class="max-w-[200px]">Estes são alguns dos trabalhos e projetos que já realizei.</p>
                </div>
                <div class="mt-8">
                    <PrimaryButton title="Todos" disabled />
                </div>
                <div class="mt-4">
                    <MyCases />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import NavLink from '../components/partials/NavLink.vue';
    import TechCards from '../components/partials/TechCards.vue';
    import MyCases from '@/components/partials/MyCases.vue';
    import PrimaryButton from '@/components/partials/PrimaryButton.vue';
</script>