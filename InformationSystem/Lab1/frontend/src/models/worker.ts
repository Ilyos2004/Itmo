// Enums
export type Status = 'HIRED' | 'REGULAR' | 'PROBATION' | 'ACTIVE' | 'FIRED' | null
export type OrganizationType = 'COMMERCIAL' | 'GOVERNMENT' | 'PRIVATE_LIMITED_COMPANY'
export type Color = 'RED' | 'BLUE' | 'WHITE'

// Base models
export interface Coordinates { x: number; y: number }
export interface Address { street: string | null }
export interface Location { x: number; y: number; z: number; name: string }

export interface Person {
    perName?: string | null
    eyeColor: Color | null
    hairColor: Color
    location: Location
    birthday: string
    height?: number | null
    weight?: number | null
    passportID: string
}

export interface Organization {
    orgName?: string | null
    officialAddress: Address
    annualTurnover: number
    employeesCount: number
    rating: number
    type: OrganizationType
}

export interface Worker {
    id: number
    name: string
    coordinates: Coordinates
    creationDate: string
    organization?: Organization | null
    organizationId?: number | null
    salary: number
    rating?: number | null
    startDate: string
    endDate?: string | null
    status?: Status | null
    person?: Person | null
    personId?: number | null
}

export interface Page<T> {
    items: T[]
    total: number
}


export type LinkExisting = { mode: 'existing'; id: number }
export type LinkNew<T>   = { mode: 'new'; data: T }
export type LinkOptional<T> = null | LinkExisting | LinkNew<T>

export type WorkerInput = {
    name: string
    coordinates: Coordinates
    salary: number
    rating?: number | null
    startDate: string
    endDate?: string | null
    status?: Status | null

    organization: LinkExisting | LinkNew<Organization>
    person: LinkOptional<Person>
}
