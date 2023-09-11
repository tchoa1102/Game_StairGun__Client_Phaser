import type { AxiosInstance } from 'axios'
import createApiClient from './api.service'

class BaseService {
    private api: AxiosInstance
    constructor(baseURL = '/') {
        this.api = createApiClient(baseURL)
    }
    async get(slug: string) {
        return (await this.api.get(`/${slug}`)).data
    }

    async getAll() {
        return (await this.api.get('/')).data
    }

    async create(data: any) {
        return (await this.api.post('/', data)).data
    }

    async update(slug: string, data: any) {
        return (await this.api.patch(`/${slug}`, data)).data
    }

    async delete(id: string) {
        return (await this.api.delete(`/${id}`)).data
    }
}

export default BaseService
