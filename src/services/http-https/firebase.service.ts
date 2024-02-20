import axios, { type AxiosResponse } from 'axios'
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
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

const firebaseSettings: FirebaseOptions = {
    apiKey: import.meta.env.FIREBASE_API_KEY,
    authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FIREBASE_MESSAGIN_SENDER_ID,
    appId: import.meta.env.FIREBASE_APP_ID,
}
// console.log('firebaseSettings: ', firebaseSettings, import.meta.env.FIREBASE_API_KEY)
async function saveUser(accessToken: string) {
    await axios
        .create({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .get(import.meta.env.VITE_API + '/auth/login')
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
            // const result: UserCredential = await signInWithPopup(this.auth, this.provider)
            const result: UserCredential = await signInWithPopup(this.auth, this.provider)
            await saveUser((result.user as any).accessToken)
            return result
        } catch (e) {
            console.log(e)
        }

        return null
    }

    async logOut() {}

    async autoSignIn(route: RouteLocationNormalizedLoaded, router: Router) {
        onAuthStateChanged(
            this.auth,
            async (user: User | null) => {
                console.group('Authorization')
                console.log('user: ', user)
                console.log('auth: ', this.auth)
                // user is not existing, then redirect to login page
                if (!user) {
                    return router.push({ name: 'login' })
                }

                try {
                    const userLoaded = await authService.loadUser()
                    console.log('player loaded: ', userLoaded)
                    const mainStore = useMainStore()
                    mainStore.player = { ...userLoaded }
                    console.log('Player loaded: ', mainStore.player)
                } catch (error) {
                    console.log('User loaded ERROR: ', error)
                }

                // user !== null and this page is login page, then redirect to home page
                if (route.name === 'login') {
                    return router.push({ name: 'home' })
                }
                console.groupEnd()
            },
            (e: Error) => {
                router.push({ name: 'login' })
                console.log('Auto login failure!', e)
            },
        )
    }
}

export default new FirebaseService()
