<template>
    <!-- Usamos @click.prevent para interceptar o clique e decidir o comportamento via JavaScript -->
    <a :href="computedLink" :title="title" :target="target" @click.prevent="navigate"
        class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-200 dark:hover:text-gray-400">
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
    },
    computed: {
        // Garante que o atributo href no HTML exiba o formato correto para SEO e acessibilidade
        computedLink() {
            if (this.link.startsWith('#')) {
                return `/${this.link}`;
            }
            return `/${this.link.startsWith('/') ? '' : '/'}${this.link}`;
        }
    },
    methods: {
        navigate() {
            // Se o link for uma âncora pura (ex: "#suporte" ou "#contato")
            if (this.link.startsWith('#')) {
                // 1. Força o Vue Router a ir para a Home primeiro (caso o usuário esteja no simulador)
                this.$router.push('/').then(() => {
                    // 2. Procura o ID na página e faz a rolagem suave
                    const element = document.querySelector(this.link);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            } else {
                // Se for uma rota normal (ex: "/simular-apostas-com-dados"), deixa o Vue Router mudar de view
                this.$router.push(this.link);
            }
        }
    }
}
</script>
