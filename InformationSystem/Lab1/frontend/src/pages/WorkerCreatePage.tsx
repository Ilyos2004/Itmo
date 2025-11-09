import { useNavigate, useSearchParams } from 'react-router-dom'
import WorkerForm from '@/components/WorkerForm'
import { createWorker, getWorker } from '@/api/workers'
import { createOrganization, createPerson } from '@/api/refs'
import { useEffect, useState } from 'react'
import type { Worker, WorkerInput } from '@/models/worker'

export default function WorkerCreatePage(){
    const nav = useNavigate()
    const [params] = useSearchParams()
    const copyId = params.get('copy')
    const [initial, setInitial] = useState<Partial<Worker> | undefined>()

    useEffect(()=>{
        (async()=>{
            if (copyId) {
                const src = await getWorker(Number(copyId))
                const { id, creationDate, ...rest } = src
                setInitial(rest)
            }
        })()
    }, [copyId])

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Создать работника</h1>
            <div className="card">
                <WorkerForm
                    initial={initial}
                    submitText="Создать"
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
                            if (input.person.mode === 'existing') {
                                personId = input.person.id
                            } else {
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

                        await createWorker(dto as any)
                        nav('/')
                    }}
                />
            </div>
        </div>
    )
}
