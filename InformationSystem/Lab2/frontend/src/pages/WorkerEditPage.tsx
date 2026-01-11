import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWorker, updateWorker } from '@/api/workers'
import type { Worker, WorkerInput } from '@/models/worker'
import WorkerForm from '@/components/WorkerForm'
import WorkerDetails from '@/components/WorkerDetails'
import { createOrganization, createPerson } from '@/api/refs'

export default function WorkerEditPage(){
    const { id } = useParams()
    const nav = useNavigate()
    const [w, setW] = useState<Worker | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        (async()=>{
            if (!id) return
            try { setW(await getWorker(Number(id))) }
            finally { setLoading(false) }
        })()
    }, [id])

    if (loading) return <div>Загрузка...</div>
    if (!w) return <div>Не найдено</div>

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Изменить работника #{w.id}</h1>
            <WorkerDetails w={w} />
            <div className="card">
                <WorkerForm
                    initial={w}
                    onSubmit={async (input: WorkerInput)=>{
                        let organizationId: number
                        if (input.organization.mode === 'existing') {
                            organizationId = input.organization.id
                        } else {
                            const created = await createOrganization(input.organization.data)
                            organizationId = created.id
                        }

                        let personId: number | null = null
                        if (input.person) {
                            if (input.person.mode === 'existing') personId = input.person.id
                            else {
                                const createdP = await createPerson(input.person.data)
                                personId = createdP.id
                            }
                        }

                        const dto = {
                            name: input.name,
                            coordinates: input.coordinates,
                            salary: input.salary,
                            rating: input.rating ?? null,
                            startDate: input.startDate,
                            endDate: input.endDate ?? null,
                            status: input.status ?? null,
                            organizationId,
                            personId,
                        }

                        await updateWorker(w.id, dto as any)
                        nav('/')
                    }}
                />
            </div>
        </div>
    )
}
