<template>
    <section id="game"></section>
</template>

<script>
import { useMainStore } from '@/stores/index'
export default {
    setup() {
        const mainStore = useMainStore()
        return {
            mainStore,
        }
    },
    data() {
        return {}
    },
    created() {
        /**
         * If you don't log in, then you will be redirected to Login Screen.
         */
    },
    mounted() {
        console.log(document.getElementById('main').getBoundingClientRect().height)
        this.mainStore.init(document.getElementById('main').getBoundingClientRect().height, {
            parent: 'game',
        })
    },
}
</script>
