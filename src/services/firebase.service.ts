import { getToken } from '@/util/shares'
import axios, { type AxiosResponse } from 'axios'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    type Auth,
    type UserCredential,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    type User,
} from 'firebase/auth'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

import { useMainStore } from '@/stores'
import authService from './auth.service'

const firebaseSettings = {
    apiKey: 'AIzaSyCWB2y7o4HkwG2i1XJbDxO7eTtEfkRMwME',
    authDomain: 'middleware-auth-2221e.firebaseapp.com',
    projectId: 'middleware-auth-2221e',
    storageBucket: 'middleware-auth-2221e.appspot.com',
    messagingSenderId: '17874562481',
    appId: '1:17874562481:web:62c90da73c4e343b0aa190',
}
async function saveUser(accessToken: string) {
    await axios
        .create({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .get('http://localhost:4000/api/auth/login')
}

class FirebaseService {
    public auth: Auth

    private app: FirebaseApp
    private provider: GoogleAuthProvider
    constructor() {
        this.app = initializeApp(firebaseSettings)
        this.provider = new GoogleAuthProvider()
        this.auth = getAuth(this.app)
    }

    async signInWithGoogle() {
        try {
            await setPersistence(this.auth, browserLocalPersistence)
            const result: UserCredential = await signInWithPopup(this.auth, this.provider)
            await saveUser((result.user as any).accessToken)
            return result
        } catch (e) {
            console.log(e)
        }

        return null
    }

    autoSignIn(route: RouteLocationNormalizedLoaded, router: Router) {
        onAuthStateChanged(
            this.auth,
            async (user: User | null) => {
                console.log('user: ', user)
                console.log('auth: ', this.auth)
                // user is not existing, then redirect to login page
                if (!user) {
                    return router.push({ name: 'login' })
                }

                const userLoaded = await authService.loadUser()
                const mainStore = useMainStore()
                mainStore.player = { ...userLoaded }
                console.log('Player loaded: ', mainStore.player)

                // user !== null and this page is login page, then redirect to home page
                if (route.name === 'login') {
                    return router.push({ name: 'home' })
                }
            },
            (e: Error) => {
                router.push({ name: 'login' })
                console.log(e)
            },
        )
    }
}

export default new FirebaseService()
