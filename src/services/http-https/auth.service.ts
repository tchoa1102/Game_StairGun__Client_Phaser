import { regexResponse } from '@/util/shares'
import createApiClient from './api.service'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import firebaseService from './firebase.service'

class AuthService {
    api: AxiosInstance
    constructor() {
        this.api = createApiClient('http://localhost:4000/api/auth')

        this.api.interceptors.request.use(async function (
            config: InternalAxiosRequestConfig<any>,
        ): Promise<InternalAxiosRequestConfig<any>> {
            const accessToken = await firebaseService.auth.currentUser?.getIdToken()
            config.headers.Authorization = `Bearer ${accessToken}`
            return config
        })
    }

    async loadUser() {
        const result = await this.api.get('/load')
        return regexResponse(result)
    }
}

export default new AuthService()
