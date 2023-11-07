import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import createApiClient from './api.service'
import firebaseService from './firebase.service'
import { regexResponse } from '@/util/shares'

class BaseService {
    api: AxiosInstance

    constructor(baseURL = '/') {
        this.api = createApiClient(baseURL)

        this.api.interceptors.request.use(async function (
            config: InternalAxiosRequestConfig<any>,
        ): Promise<InternalAxiosRequestConfig<any>> {
            const accessToken = await firebaseService.auth.currentUser?.getIdToken()
            config.headers.Authorization = `Bearer ${accessToken}`
            return config
        })
    }

    async get(slug: string) {
        return regexResponse(await this.api.get(`/${slug}`))
    }

    async getAll() {
        return regexResponse(await this.api.get('/'))
    }

    async create(data: any) {
        return regexResponse(await this.api.post('/', data))
    }

    async update(slug: string, data: any) {
        return regexResponse(await this.api.patch(`/${slug}`, data))
    }

    async delete(id: string) {
        return regexResponse(await this.api.delete(`/${id}`))
    }
}

export default BaseService
