import axios from 'axios'
import { authStorage } from '@/auth/storage'

function isPlainObject(v: any): v is Record<string, any> {
    return v != null && typeof v === 'object' && !Array.isArray(v)
}

function isProbablyHtml(data: any, contentType?: string): boolean {
    const ct = (contentType ?? '').toLowerCase()
    if (ct.includes('text/html')) return true
    if (typeof data !== 'string') return false
    const s = data.trim().toLowerCase()
    return s.startsWith('<!doctype html') || s.startsWith('<html') || s.includes('<body')
}

function hasErrorShape(data: any): boolean {
    if (!isPlainObject(data)) return false
    return (
        'error' in data ||
        'errors' in data ||
        'exception' in data ||
        'trace' in data ||
        ('path' in data && 'status' in data && 'message' in data)
    )
}

function pickMessageFromPayload(data: any): string | null {
    if (!data) return null
    if (typeof data === 'string') return data.slice(0, 200)
    if (isPlainObject(data)) {
        if (typeof data.message === 'string') return data.message
        if (typeof data.error === 'string') return data.error
        if (Array.isArray(data.errors) && data.errors.length) return String(data.errors[0])
    }
    return null
}

/** анти-спам для alert */
let lastAlertAt = 0
function safeAlert(msg: string) {
    const now = Date.now()
    if (now - lastAlertAt < 1500) return
    lastAlertAt = now
    // eslint-disable-next-line no-alert
    alert(msg)
}

function logBadSuccessResponse(res: any) {
    try {
        const method = res?.config?.method?.toUpperCase?.() ?? 'GET'
        const url = res?.config?.url ?? ''
        const status = res?.status
        const ct = res?.headers?.['content-type'] ?? res?.headers?.['Content-Type']

        // 1) пустое тело на 200/201
        if ((status === 200 || status === 201) && (res.data === undefined || res.data === null)) {
            console.log('[http] suspicious success: empty body', { method, url, status, contentType: ct })
            safeAlert(`Сервер вернул пустой ответ: ${method} ${url}`)
        }

        // 2) пришёл HTML вместо JSON
        if (isProbablyHtml(res.data, ct)) {
            console.log('[http] suspicious success: HTML returned', {
                method, url, status, contentType: ct,
                preview: typeof res.data === 'string' ? res.data.slice(0, 200) : res.data
            })
            safeAlert(`Сервер вернул HTML вместо JSON: ${method} ${url}`)
        }

        // 3) успешный статус, но payload похож на ошибку
        if (hasErrorShape(res.data)) {
            console.log('[http] suspicious success: error-shaped payload', {
                method, url, status, contentType: ct, data: res.data
            })
            const msg = pickMessageFromPayload(res.data)
            safeAlert(msg ? `Ошибка от сервера: ${msg}` : `Подозрительный ответ сервера: ${method} ${url}`)
        }
    } catch (e) {
        console.log('[http] bad-success-log failed:', e)
    }
}

function buildUserAlert(error: any): string {
    const status = error?.response?.status
    const method = error?.config?.method?.toUpperCase?.() ?? 'GET'
    const url = error?.config?.url ?? ''
    const payloadMsg = pickMessageFromPayload(error?.response?.data)

    // Нет ответа (например ECONNREFUSED, CORS, сервер упал)
    if (!status) {
        return `Сервер недоступен или нет соединения.\n${method} ${url}`
    }

    if (status === 401) return `Не авторизован. Выполните вход.\n${method} ${url}`
    if (status === 403) return `Нет доступа (403).\n${method} ${url}`
    if (status === 404) return `Эндпоинт не найден (404).\n${method} ${url}`

    return payloadMsg
        ? `Ошибка ${status}: ${payloadMsg}\n${method} ${url}`
        : `Ошибка ${status}.\n${method} ${url}`
}

export const http = axios.create({
    baseURL: '',
    withCredentials: true, // если используете cookie/session — оставить true
})

// request: добавляем Bearer если есть токен
http.interceptors.request.use(
    (config) => {
        const token = authStorage.getToken()
        if (token) {
            config.headers = config.headers ?? {}
            ;(config.headers as any).Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.log('[http] request error:', error)
        safeAlert('Ошибка формирования запроса. Смотри консоль.')
        return Promise.reject(error)
    }
)

// response: логируем ошибки и "странные" успешные ответы + показываем alert
http.interceptors.response.use(
    (res) => {
        logBadSuccessResponse(res)
        return res
    },
    (error) => {
        const status = error?.response?.status
        const url = error?.config?.url
        const method = error?.config?.method?.toUpperCase?.() ?? 'GET'

        console.log('[http] response error:', {
            method,
            url,
            status,
            data: error?.response?.data,
            error
        })

        // alert для пользователя
        safeAlert(buildUserAlert(error))

        // авто-logout при 401
        if (status === 401) {
            const isAuthEndpoint =
                typeof url === 'string' &&
                (url.includes('/api/auth/login') || url.includes('/api/auth/register') || url.includes('/api/auth/me'))

            authStorage.clear()

            if (!isAuthEndpoint) {
                if (window.location.pathname !== '/login') {
                    window.location.assign('/login')
                }
            }
        }

        return Promise.reject(error)
    }
)
