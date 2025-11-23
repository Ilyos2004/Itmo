import { http } from './client'
import type { Organization, Person } from '@/models/worker'

// Универсальная распаковка ответов бэка в массив
function toArray(raw: any, embeddedKey?: string): any[] {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    if (embeddedKey && raw._embedded && Array.isArray(raw._embedded[embeddedKey])) return raw._embedded[embeddedKey]
    if (Array.isArray(raw.content)) return raw.content
    if (Array.isArray(raw.items)) return raw.items
    const vals = Object.values(raw)
    if (vals.length && vals.every(v => v && typeof v === 'object')) return vals as any[]
    return []
}

// Пытаемся извлечь id независимо от имени/типа поля
function pickId(x: any): number | null {
    if (!x || typeof x !== 'object') return null
    for (const k of ['id', 'ID', 'Id']) {
        const v = x[k]
        if (typeof v === 'number') return v
        if (typeof v === 'string' && /^\d+$/.test(v)) return Number(v)
    }
    return null
}

// Нормализация списка для селектов

export type OrganizationRowNormalized = {
    id: number
    label: string
    raw: any
}

export async function listOrganizations(): Promise<OrganizationRowNormalized[]> {
    const res = await http.get<any>('/api/organizations')
    const rows = toArray(res.data, 'organizations')
    return rows
        .map((x: any) => {
            const id = pickId(x)
            if (id == null) return null
            const orgName = x.orgName ?? x.name ?? x.title ?? null   
            const type = x.type ?? x.organizationType ?? null
            const rating = x.rating ?? x.orgRating ?? null
            const parts: string[] = []
            if (orgName) parts.push(String(orgName))
            if (type) parts.push(`type: ${type}`)
            if (rating != null) parts.push(`rating: ${rating}`)
            const label = `#${id} — ${parts.length ? parts.join(' — ') : 'Организация'}`
            return { id, label, raw: x }
        })
        .filter(Boolean) as OrganizationRowNormalized[]
}

export type PersonRowNormalized = {
    id: number
    label: string
    raw: any
}

export async function listPersons(): Promise<PersonRowNormalized[]> {
    const res = await http.get<any>('/api/persons')
    const rows = toArray(res.data, 'persons')
    return rows
        .map((x: any) => {
            const id = pickId(x)
            if (id == null) return null
            const perName = x.perName ?? x.fullName ?? x.name ?? null 
            const passport = x.passportID ?? x.passportId ?? null
            const parts: string[] = []
            if (perName) parts.push(String(perName))
            if (passport) parts.push(`passport: ${passport}`)
            const label = `#${id} — ${parts.length ? parts.join(' — ') : 'Person'}`
            return { id, label, raw: x }
        })
        .filter(Boolean) as PersonRowNormalized[]
}

// Создание сущностей с нужными для бэка

function orgToCreateDto(org: Organization | any) {
    return {
        orgName: org?.orgName ?? null,                                 
        street: org?.officialAddress?.street ?? org?.street ?? null,
        annualTurnover: Number(org?.annualTurnover),
        employeesCount: Number(org?.employeesCount),
        rating: Number(org?.rating),
        type: org?.type,
    }
}

export async function createOrganization(org: Organization | any): Promise<{ id: number }> {
    const dto = orgToCreateDto(org)
    const res = await http.post<any>('/api/organizations', dto)
    const id = pickId(res.data)
    if (id == null) {
        if (typeof res.data === 'number') return { id: res.data }
        throw new Error('Не удалось определить ID созданной организации')
    }
    return { id }
}

function personToCreateDto(p: Person | any) {
    return {
        perName: p?.perName ?? null,                                  
        eyeColor: p?.eyeColor ?? null,
        hairColor: p?.hairColor,
        location: {
            x: Number(p?.location?.x),
            y: Number(p?.location?.y),
            z: Number(p?.location?.z),
            name: String(p?.location?.name ?? ''),
        },
        birthday: p?.birthday,
        height: p?.height != null ? Number(p.height) : null,
        weight: p?.weight != null ? Number(p.weight) : null,
        passportID: String(p?.passportID ?? ''),
    }
}

export async function createPerson(p: Person | any): Promise<{ id: number }> {
    const dto = personToCreateDto(p)
    const res = await http.post<any>('/api/persons', dto)
    const id = pickId(res.data)
    if (id == null) {
        if (typeof res.data === 'number') return { id: res.data }
        throw new Error('Не удалось определить ID созданной персоны')
    }
    return { id }
}
