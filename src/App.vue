<template>

  <Header />
  <Content />
  <Footer />

</template>

<script>
    import Header from './components/layout/Header.vue'
    import Content from './components/layout/Content.vue'
    import Footer from './components/layout/Footer.vue'

    export default {
        name: 'App',
        components: {
            Header,
            Content,
            Footer
        }
    }
</script>
