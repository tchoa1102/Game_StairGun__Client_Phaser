<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMainStore } from './stores'
import { type Router, useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import firebaseService from './services/http-https/firebase.service'

const mainStore = useMainStore()
watch(
    () => mainStore.player._id !== undefined,
    () => {
        mainStore.connection()
        mainStore.socket!.on('connection', async (data: any) => {
            mainStore.player.clientId = data.clientId
            mainStore.player.socketId = data.socketId

            console.group('Socket Connection: ')
            console.log('data: ', data)
            console.log('player: ', mainStore.player)
            console.groupEnd()
        })
    },
)
onMounted(async () => {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const router: Router = useRouter()
    console.log('Route: ', route)
    await firebaseService.autoSignIn(route, router)
})
</script>

<template>
    <main id="main">
        <RouterView />
    </main>
</template>

<style scoped>
main {
    display: flex;
    height: 100vh;
    background-color: #000;
}
</style>
