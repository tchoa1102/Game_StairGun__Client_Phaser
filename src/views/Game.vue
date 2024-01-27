<template>
    <section id="game">
        <section class="toast-component"></section>
        <section
            id="game-temp"
            style="position: fixed; top: 0; left: 0; z-index: 100000000"
        ></section>
    </section>
</template>

<script lang="ts">
import { useMainStore } from '@/stores'
import type IIndicator from '@/util/interface/init.interface'
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
            console.log('Start game')
            const initObj: IIndicator = {
                parent: 'game',
                canvas: undefined,
            }
            this.mainStore.init(
                document.getElementById('main')!.getBoundingClientRect().height,
                initObj,
            )
        },
    },
    mounted() {
        console.log('Mounted game')
    },
}
</script>

<style></style>
