type Ctx = {
    tag: string
    url?: string
    expected: string
    data: any
}

function preview(data: any) {
    if (typeof data === 'string') return data.slice(0, 200)
    try { return JSON.stringify(data).slice(0, 400) } catch { return data }
}

export function logIfBad(ok: boolean, ctx: Ctx) {
    if (ok) return
    console.log('[api] bad response:', {
        tag: ctx.tag,
        url: ctx.url,
        expected: ctx.expected,
        preview: preview(ctx.data),
        data: ctx.data
    })
}

export function ensureArray<T = any>(data: any, ctx: Omit<Ctx,'expected'|'data'> & { expected?: string }): T[] {
    const ok = Array.isArray(data)
    logIfBad(ok, { ...ctx, expected: ctx.expected ?? 'Array', data })
    return ok ? (data as T[]) : []
}

export function ensureNumber(data: any, ctx: Omit<Ctx,'expected'|'data'> & { expected?: string }): number {
    const ok = typeof data === 'number' && Number.isFinite(data)
    logIfBad(ok, { ...ctx, expected: ctx.expected ?? 'number', data })
    return ok ? data : 0
}

export function ensureObject<T extends Record<string, any> = any>(data: any, ctx: Omit<Ctx,'expected'|'data'> & { expected?: string }): T {
    const ok = data != null && typeof data === 'object' && !Array.isArray(data)
    logIfBad(ok, { ...ctx, expected: ctx.expected ?? 'object', data })
    return ok ? (data as T) : ({} as T)
}

export function ensureString(data: any, ctx: Omit<Ctx,'expected'|'data'> & { expected?: string }): string {
    const ok = typeof data === 'string'
    logIfBad(ok, { ...ctx, expected: ctx.expected ?? 'string', data })
    return ok ? data : ''
}

/** Универсально вытаскиваем id из ответа (и логируем если не получилось) */
export function extractId(data: any, ctx: Omit<Ctx,'expected'|'data'>): number | null {
    if (typeof data === 'number' && Number.isFinite(data)) return data
    if (data && typeof data === 'object') {
        for (const k of ['id', 'ID', 'Id']) {
            const v = (data as any)[k]
            if (typeof v === 'number' && Number.isFinite(v)) return v
            if (typeof v === 'string' && /^\d+$/.test(v)) return Number(v)
        }
    }
    console.log('[api] bad response: cannot extract id', { tag: ctx.tag, url: ctx.url, data })
    return null
}
