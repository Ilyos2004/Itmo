import { http } from './client'
import type { Worker } from '@/models/worker'

// Вернеть количество объектов, значение поля rating которых равно заданному.
export async function countByRating(rating: number): Promise<number> {
    const res = await http.get<number>('/api/special/count-by-rating', { params: { rating } })
    return res.data
}

// Вернеть массив объектов, значение поля startDate которых меньше заданного.
export async function startBefore(ts: string): Promise<Worker[]> {
    const res = await http.get<Worker[]>('/api/special/start-before', { params: { ts } })
    return res.data
}

// Вернеть массив уникальных значений поля person по всем объектам.
export async function uniquePersons(): Promise<number[]> {
    const res = await http.get<number[]>('/api/special/unique-persons')
    return res.data
}

// Уволить сотрудника с заданным id из организации.
export async function fire(id: number): Promise<void> {
    await http.post('/api/special/fire', null, { params: { id } })
}

// Проиндексировать заработную плату указанному сотруднику на заданный коэффициент
export async function indexSalary(id: number, factor: number): Promise<void> {
    await http.post('/api/special/index-salary', null, { params: { id, factor } })
}
