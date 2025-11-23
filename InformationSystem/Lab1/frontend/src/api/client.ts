import axios from 'axios'


const baseURL = ''


export const http = axios.create({ baseURL })



http.interceptors.response.use(
    (r) => r,
    (err) => {
        const msg = err?.response?.data?.message || err.message
        console.error('API error:', msg)
        return Promise.reject(err)
    }
)
