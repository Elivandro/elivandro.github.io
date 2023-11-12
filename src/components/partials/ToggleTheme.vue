<template>
    <a href="#" @click.prevent="toggleDark()">
        <img :src="iconSrc" class='w-5 h-5' :title="theme ? 'light theme' : 'dark theme'" />
    </a>
</template>

<script>
    import { useDark, useToggle } from '@vueuse/core';
    import { computed } from 'vue';

    import sunImage from '../../assets/icon/sun-light.svg';
    import moonImage from '../../assets/icon/moon-light.svg';

    export default {
        setup() {
            const isDark = useDark();
            const toggleDark = useToggle(isDark);

            const theme = computed(() => isDark.value);
            const iconSrc = computed(() => (theme.value ? sunImage : moonImage));
    
            return {
                theme,
                toggleDark,
                iconSrc,
            };
        },
    };
</script>
  