import { regexResponse } from '@/util/shares'
import createApiClient from './api.service'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import firebaseService from './firebase.service'

class AuthService {
    api: AxiosInstance
    constructor() {
        this.api = createApiClient(import.meta.env.VITE_API + '/auth')

        this.api.interceptors.request.use(async function (
            config: InternalAxiosRequestConfig<any>,
        ): Promise<InternalAxiosRequestConfig<any>> {
            const accessToken = await firebaseService.auth.currentUser?.getIdToken()
            config.headers.Authorization = `Bearer ${accessToken}`
            return config
        })
    }

    async loadUser() {
        console.log('Loading user...')
        const result = await this.api.get('/load')
        return regexResponse(result)
    }
}

export default new AuthService()
