import { http } from './client'
import { authStorage } from '@/auth/storage'

export type Role = 'ROLE_USER' | 'ROLE_ADMIN' | 'USER' | 'ADMIN'

export type MeResponse = {
    username?: string
    login?: string
    name?: string
    roles?: Role[]
    role?: Role
}

export type LoginRequest = { username: string; password: string }

export type RegisterRequest = { username: string; password: string; role: 'USER' }

function extractToken(data: any): string | null {
    if (!data) return null
    if (typeof data === 'string') return data
    return data.token || data.accessToken || data.jwt || data.jwtToken || data?.data?.token || null
}

export async function login(req: LoginRequest): Promise<MeResponse> {
    const res = await http.post<any>('/api/auth/login', req)

    const token = extractToken(res.data)
    if (token) authStorage.setToken(token)
    else console.log('[auth] login: token not found in response:', res.data)

    return await me()
}

export async function register(username: string, password: string): Promise<void> {
    const payload: RegisterRequest = { username, password, role: 'USER' }
    const res = await http.post<any>('/api/auth/register', payload)

    if (res?.data && typeof res.data === 'object' && (res.data.error || res.data.errors)) {
        console.log('[auth] register suspicious response:', res.data)
    }
}

export async function me(): Promise<MeResponse> {
    const res = await http.get<MeResponse>('/api/auth/me')
    if (!res?.data) console.log('[auth] me: empty response data', res)
    return res.data ?? {}
}

export async function logout(): Promise<void> {
    authStorage.clear()
}
