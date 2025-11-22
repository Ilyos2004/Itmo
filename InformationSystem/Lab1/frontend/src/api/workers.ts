import { http } from './client'
import type { Worker } from '@/models/worker'

export async function listWorkers(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDir?: 'asc' | 'desc'
    nameContains?: string
    minSalary?: number
    maxSalary?: number
}) {
    const { page = 1, size = 10, sortBy, sortDir = 'asc', nameContains, minSalary, maxSalary } = params || {}

    const res = await http.get<any>('/api/workers')
    const raw = res.data


    let data: Worker[] = []
    if (Array.isArray(raw)) {
        data = raw
    } else if (raw && typeof raw === 'object') {
        if (Array.isArray(raw.content)) data = raw.content // Spring Page
        else if (Array.isArray(raw.items)) data = raw.items
        else if (raw._embedded && Array.isArray(raw._embedded.workers)) data = raw._embedded.workers
        else {
            const vals = Object.values(raw)
            if (vals.length && vals.every(v => v && typeof v === 'object')) {
                data = vals as Worker[]
            }
        }
    }

    if (!Array.isArray(data)) data = []

    //  фильтры
    let filtered = data
    if (nameContains && nameContains.trim()) {
        const q = nameContains.toLowerCase()
        filtered = filtered.filter(w => (w?.name ?? '').toLowerCase().includes(q))
    }
    if (minSalary != null) filtered = filtered.filter(w => Number(w?.salary) >= Number(minSalary))
    if (maxSalary != null) filtered = filtered.filter(w => Number(w?.salary) <= Number(maxSalary))

    // сортировка
    if (sortBy) {
        const dir = sortDir === 'desc' ? -1 : 1
        filtered = [...filtered].sort((a: any, b: any) => {
            const va = a?.[sortBy]
            const vb = b?.[sortBy]
            
            if (va == null && vb == null) return 0
            if (va == null) return 1
            if (vb == null) return -1

            // Попытка привести строки-даты к числу
            const toComp = (v: any) => {
                if (typeof v === 'string') {
                    const t = Date.parse(v)
                    if (!isNaN(t)) return t
                }
                return v
            }

            const na = toComp(va)
            const nb = toComp(vb)

            if (na < nb) return -1 * dir
            if (na > nb) return 1 * dir
            return 0
        })
    }

    const total = filtered.length
    const start = (page - 1) * size
    const items = filtered.slice(start, start + size)

    return { items, total }
}



export const getWorker = (id: number) => http.get<Worker>(`/api/workers/${id}`).then(r=>r.data)
export const createWorker = (w: Partial<Worker>) => http.post<Worker>('/api/workers', w).then(r=>r.data)
export const updateWorker = (id: number, w: Partial<Worker>) => http.put<Worker>(`/api/workers/${id}`, w).then(r=>r.data)
export const deleteWorker = (id: number) => http.delete(`/api/workers/${id}`)
export const deleteBulk = (ids: number[]) => http.delete('/api/workers', { data: ids })




export const countByRating = (rating: number) => http.get<number>('/api/special/count-by-rating', { params: { rating } }).then(r=>r.data)
export const startBefore = (ts: string) => http.get<Worker[]>('/api/special/start-before', { params: { ts } }).then(r=>r.data)
export const uniquePersons = () => http.get<number[]>('/api/special/unique-persons').then(r=>r.data)
export const fire = (id: number) => http.post('/api/special/fire', null, { params: { id } })
export const indexSalary = (id: number, factor: number) => http.post('/api/special/index-salary', null, { params: { id, factor } })
