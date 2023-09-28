<template>
    <section id="game">
        <section class="toast-component"></section>
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
