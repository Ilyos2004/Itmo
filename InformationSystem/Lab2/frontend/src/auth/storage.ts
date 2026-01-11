const TOKEN_KEY = 'auth_token'

export const authStorage = {
    getToken(): string | null {
        try {
            return localStorage.getItem(TOKEN_KEY)
        } catch (e) {
            console.log('[authStorage] getToken error:', e)
            return null
        }
    },

    setToken(token: string) {
        try {
            localStorage.setItem(TOKEN_KEY, token)
        } catch (e) {
            console.log('[authStorage] setToken error:', e)
        }
    },

    clear() {
        try {
            localStorage.removeItem(TOKEN_KEY)
        } catch (e) {
            console.log('[authStorage] clear error:', e)
        }
    }
}
