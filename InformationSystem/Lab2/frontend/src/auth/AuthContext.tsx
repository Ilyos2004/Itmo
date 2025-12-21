import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { MeResponse } from '@/api/auth'
import { login as apiLogin, logout as apiLogout, me as apiMe, register as apiRegister } from '@/api/auth'

type AuthState = {
    user: MeResponse | null
    isLoading: boolean
    isAuthed: boolean
    login: (username: string, password: string) => Promise<void>
    register: (username: string, password: string) => Promise<void> // без роли в UI
    logout: () => Promise<void>
    refreshMe: () => Promise<void>
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<MeResponse | null>(null)
    const [isLoading, setLoading] = useState(true)

    const refreshMe = async () => {
        try {
            const u = await apiMe()
            setUser(u && (u.username || u.login || u.name || u.roles || u.role) ? u : u)
        } catch (e) {
            console.log('[auth] refreshMe error:', e)
            setUser(null)
        }
    }

    useEffect(() => {
        ;(async () => {
            setLoading(true)
            await refreshMe()
            setLoading(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = useMemo<AuthState>(() => ({
        user,
        isLoading,
        isAuthed: !!user,
        login: async (username, password) => {
            try {
                const u = await apiLogin({ username, password })
                setUser(u)
            } catch (e) {
                console.log('[auth] login error:', e)
                throw e
            }
        },
        register: async (username, password) => {
            try {
                // role отправляется внутри apiRegister() как USER
                await apiRegister(username, password)
            } catch (e) {
                console.log('[auth] register error:', e)
                throw e
            }
        },
        logout: async () => {
            try {
                await apiLogout()
            } catch (e) {
                console.log('[auth] logout error:', e)
            } finally {
                setUser(null)
            }
        },
        refreshMe,
    }), [user, isLoading])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
