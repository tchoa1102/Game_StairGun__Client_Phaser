import axios, { type AxiosInstance } from 'axios'

const commonConfig = {
    // headers: {
    // "Content-Type": "application/json",
    // Accept: "application/json",
    // }
}
//multipart/form-data
//application/x-www-form-urlencoded
export default (baseURL: string): AxiosInstance => {
    return axios.create({
        baseURL,
        ...commonConfig,
    })
}
