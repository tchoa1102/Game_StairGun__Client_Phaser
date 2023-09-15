import { initializeApp } from 'firebase/app'
import {
    browserLocalPersistence,
    browserPopupRedirectResolver,
    browserSessionPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    signInWithPopup,
} from 'firebase/auth'

const firebaseSettings = {
    apiKey: 'AIzaSyCWB2y7o4HkwG2i1XJbDxO7eTtEfkRMwME',
    authDomain: 'middleware-auth-2221e.firebaseapp.com',
    projectId: 'middleware-auth-2221e',
    storageBucket: 'middleware-auth-2221e.appspot.com',
    messagingSenderId: '17874562481',
    appId: '1:17874562481:web:62c90da73c4e343b0aa190',
}

const app = initializeApp(firebaseSettings)
export const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        localStorage.setItem('accessToken', (result.user as any).accessToken)
        localStorage.setItem('refreshToken', result.user.refreshToken)

        const proactiveRefresh = (result.user as any).proactiveRefresh
        proactiveRefresh.isRunning = true
        const timer = setInterval(async () => {
            // console.log('time expired, ', proactiveRefresh)
            const newAccessToken = await auth.currentUser?.getIdToken(true)
            localStorage.setItem('accessToken', newAccessToken!)

            return
        }, proactiveRefresh.errorBackoff - 5000)
        proactiveRefresh.timerId = timer

        // clearTimeout(timer)
        return result
    } catch (e) {
        console.log(e)
    }

    return null
}
