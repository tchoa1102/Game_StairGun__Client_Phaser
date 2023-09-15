<script setup lang="ts">
import { onMounted } from 'vue'
import { useMainStore } from './stores'
import { useRoute, useRouter } from 'vue-router'

const mainStore = useMainStore()
onMounted(() => {
    mainStore.socket.on('connection', (data: any) => {
        console.log('data connection: ', data)
        mainStore.player.clientId = data.clientId
        mainStore.player.socketId = data.socketId
        console.log('Player: ', mainStore.player)
    })
})
const route = useRoute()
console.log([route])
if (!localStorage.getItem('accessToken')) {
    const router = useRouter()
    router.push({ name: 'login' })
}
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
