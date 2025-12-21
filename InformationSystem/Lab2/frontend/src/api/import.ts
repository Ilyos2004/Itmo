import { http } from './client'

export type ImportStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'PENDING' | string

export type ImportHistoryItem = {
    id: number
    status: ImportStatus
    username: string
    addedCount?: number | null
    message?: string | null
    createdAt?: string | null
}

function toArray(raw: any, embeddedKey?: string): any[] {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    if (embeddedKey && raw._embedded && Array.isArray(raw._embedded[embeddedKey])) return raw._embedded[embeddedKey]
    if (Array.isArray(raw.content)) return raw.content
    if (Array.isArray(raw.items)) return raw.items
    return []
}

export async function importWorkers(file: File): Promise<any> {
    const fd = new FormData()

    // ВАЖНО: должно совпадать с @RequestPart("file")
    fd.append('file', file)

    console.log('[import] uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type || '(no type)',
        field: 'file',
    })

    // Можно вообще НЕ ставить Content-Type вручную, axios сам добавит boundary.
    // Но так тоже ок.
    const res = await http.post('/api/import/workers', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
}

export async function getImportHistory(): Promise<ImportHistoryItem[]> {
    const res = await http.get<any>('/api/import/history')
    const arr = toArray(res.data, 'history')
    return (arr.length ? arr : (Array.isArray(res.data) ? res.data : [])) as ImportHistoryItem[]
}
