<script setup lang="ts">
import { onMounted } from 'vue'
import { useMainStore } from './stores'
import { type Router, useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import firebaseService from './services/firebase.service'

const mainStore = useMainStore()
onMounted(async () => {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const router: Router = useRouter()
    console.log('Route: ', route)
    mainStore.socket.on('connection', async (data: any) => {
        mainStore.player.clientId = data.clientId
        mainStore.player.socketId = data.socketId

        console.group('Connection: ')
        console.log('data connection: ', data)
        console.log('Player: ', mainStore.player)
        console.groupEnd()
    })
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
