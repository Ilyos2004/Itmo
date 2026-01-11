import { http } from './client'
import type { Worker } from '@/models/worker'
import { ensureArray, ensureNumber } from './guard'

export async function countByRating(rating: number): Promise<number> {
    const res = await http.get<any>('/api/special/count-by-rating', { params: { rating } })
    return ensureNumber(res.data, { tag: 'special.countByRating', url: '/api/special/count-by-rating' })
}

export async function startBefore(ts: string): Promise<Worker[]> {
    const res = await http.get<any>('/api/special/start-before', { params: { ts } })
    return ensureArray<Worker>(res.data, { tag: 'special.startBefore', url: '/api/special/start-before' })
}

export async function uniquePersons(): Promise<number[]> {
    const res = await http.get<any>('/api/special/unique-persons')
    const arr = ensureArray<any>(res.data, { tag: 'special.uniquePersons', url: '/api/special/unique-persons' })
    // если пришли не числа — залогируем
    const bad = arr.some(x => typeof x !== 'number')
    if (bad) console.log('[special.uniquePersons] suspicious: expected number[]', arr)
    return arr.filter(x => typeof x === 'number')
}

export async function fire(id: number): Promise<void> {
    // POST /api/special/fire?id=10
    const res = await http.post<any>('/api/special/fire', null, { params: { id } })
    // если бэк вдруг вернул error-пейлоад в 2xx — поймаем интерсептором + тут:
    if (res?.data && typeof res.data === 'object' && (res.data.error || res.data.errors)) {
        console.log('[special.fire] suspicious 2xx payload:', res.data)
    }
}

export async function indexSalary(id: number, factor: number): Promise<void> {
    const res = await http.post<any>('/api/special/index-salary', null, { params: { id, factor } })
    if (res?.data && typeof res.data === 'object' && (res.data.error || res.data.errors)) {
        console.log('[special.indexSalary] suspicious 2xx payload:', res.data)
    }
}
