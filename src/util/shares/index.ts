import type { Auth } from 'firebase/auth'

export function regexResponse(res: any) {
    if (res.status < 400) {
        return res.data
    }
    return null
}

export function getToken(time: number, auth: Auth) {
    const timer: number = setInterval(async () => {
        // console.log('time expired, ', proactiveRefresh)
        try {
            const newAccessToken = await auth.currentUser?.getIdToken(true)
            localStorage.setItem('accessToken', newAccessToken!)
        } catch (error) {
            auth.signOut()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            console.log(error)
        }
    }, time)
    return timer
}
