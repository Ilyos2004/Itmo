import { useState } from 'react'
import type { Worker, WorkerInput, LinkExisting, LinkNew, LinkOptional } from '@/models/worker'
import { validateWorker } from '@/utils/validation'
import SelectOrCreateOrganization from './SelectOrCreateOrganization'
import SelectOrCreatePerson from './SelectOrCreatePerson'

export default function WorkerForm({ initial, onSubmit, submitText = 'Сохранить' }:{
    initial?: Partial<Worker> | any
    onSubmit: (data: WorkerInput)=>Promise<void>|void
    submitText?: string
}){
    const [data, setData] = useState<Omit<WorkerInput, 'organization' | 'person'>>({
        name: initial?.name ?? '',
        coordinates: initial?.coordinates ?? { x: 0, y: 0 },
        salary: initial?.salary ?? 1,
        rating: initial?.rating ?? null,
        startDate: initial?.startDate ?? new Date().toISOString(),
        endDate: initial?.endDate ?? null,
        status: initial?.status ?? 'HIRED',
    })

    const initialOrgId = (initial as any)?.organizationId as number | undefined
    const initialPersonId = (initial as any)?.personId as number | undefined

    const [orgLink, setOrgLink] = useState<LinkExisting | LinkNew<any>>(
        initialOrgId && initialOrgId > 0
            ? { mode: 'existing', id: initialOrgId }
            : {
                mode: 'new',
                data: (initial as any)?.organization ?? {
                    orgName: '',
                    officialAddress: { street: '' },
                    annualTurnover: 1,
                    employeesCount: 1,
                    rating: 1,
                    type: 'COMMERCIAL'
                }
            }
    )

    const [personLink, setPersonLink] = useState<LinkOptional<any>>(
        initialPersonId && initialPersonId > 0
            ? { mode: 'existing', id: initialPersonId }
            : ((initial as any)?.person
                ? { mode: 'new', data: { perName: '', ...(initial as any).person } }
                : null)
    )

    const [errors, setErrors] = useState<Record<string,string>>({})
    const [busy, setBusy] = useState(false)

    const change = (path: string, value: any) => {
        setData(prev => {
            const copy: any = structuredClone(prev)
            const parts = path.split('.')
            let cur = copy
            for (let i=0;i<parts.length-1;i++) {
                cur[parts[i]] = cur[parts[i]] ?? {}
                cur = cur[parts[i]]
            }
            cur[parts[parts.length-1]] = value
            return copy
        })
    }

    const submit = async (e: any) => {
        e.preventDefault()
        const composed: WorkerInput = { ...data, organization: orgLink as any, person: personLink as any }
        const errs = validateWorker(composed)
        setErrors(errs)
        if (Object.keys(errs).length) return
        setBusy(true)
        try { await onSubmit(composed) } finally { setBusy(false) }
    }

    const err = (k:string) => errors[k] && (<div className="error mt-1">{errors[k]}</div>)

    return (
        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/*  PERSON */}
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Персона</h3>
                <SelectOrCreatePerson value={personLink as any} onChange={setPersonLink as any} />
                {err('person.id')}
                {err('person.hairColor')}
                {err('person.birthday')}
                {err('person.passportID')}
                {err('person.location.x')}
                {err('person.location.y')}
                {err('person.location.z')}
                {err('person.location.name')}
                {err('person.height')}
                {err('person.weight')}
            </div>


            {/*  WORKER */}
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Работник</h3>
                <div className="grid gap-3">
                    <div>
                        <label className="label">Имя*</label>
                        <input className="input" value={data.name ?? ''} onChange={e=>change('name', e.target.value)} />
                        {err('name')}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Коорд. X</label>
                            <input className="input" type="number" value={data.coordinates?.x ?? 0} onChange={e=>change('coordinates.x', Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="label">Коорд. Y*</label>
                            <input className="input" type="number" onChange={e=>change('coordinates.y', Number(e.target.value))} />
                            {err('coordinates.y')}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Зарплата*</label>
                            <input className="input" type="number"  onChange={e=>change('salary', Number(e.target.value))} />
                            {err('salary')}
                        </div>
                        <div>
                            <label className="label">Рейтинг</label>
                            <input className="input" type="number" value={data.rating ?? ''} onChange={e=>change('rating', e.target.value?Number(e.target.value):null)} />
                            {err('rating')}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Статус</label>
                            <select className="select" value={data.status ?? ''} onChange={e=>change('status', e.target.value)}>
                                <option value="HIRED">HIRED</option>
                                <option value="REGULAR">REGULAR</option>
                                <option value="PROBATION">PROBATION</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="FIRED">FIRED</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Дата начала*</label>
                            <input className="input" type="datetime-local" value={data.startDate ? new Date(data.startDate).toISOString().slice(0,16) : ''} onChange={e=>change('startDate', new Date(e.target.value).toISOString())} />
                            {err('startDate')}
                        </div>
                    </div>
                    <div>
                        <label className="label">Дата окончания</label>
                        <input className="input" type="date" value={data.endDate ?? ''} onChange={e=>change('endDate', e.target.value || null)} />
                    </div>
                </div>
            </div>


            {/*  ORGANIZATION */}
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Организация</h3>
                <SelectOrCreateOrganization value={orgLink as any} onChange={setOrgLink as any} />
                {err('organization.id')}
                {err('organization.annualTurnover')}
                {err('organization.employeesCount')}
                {err('organization.rating')}
                {err('organization.type')}
            </div>

            <div className="lg:col-span-2 flex gap-2 justify-end">
                <button type="submit" className="btn-primary" disabled={busy}>{submitText}</button>
            </div>
        </form>
    )
}
