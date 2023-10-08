<template>
    <section id="game">
        <section class="toast-component"></section>
        <section
            id="game-temp"
            style="position: fixed; top: 0; left: 0; z-index: 100000000"
        ></section>
    </section>
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
    watch: {
        'mainStore.player._id'() {
            this.mainStore.init(document.getElementById('main').getBoundingClientRect().height, {
                parent: 'game',
            })
        },
    },
    mounted() {},
}
</script>

<style></style>
