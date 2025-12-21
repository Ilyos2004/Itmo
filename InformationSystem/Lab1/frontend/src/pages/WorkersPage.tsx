import { Link, useNavigate } from 'react-router-dom'
import Pagination from '@/components/Pagination'
import Filters from '@/components/Filters'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useRealtime } from '@/hooks/useRealtime'
import { useWorkers } from '@/hooks/useWorkers'
import { deleteWorker } from '@/api/workers'
import { fmtMoney, fmtDate } from '@/utils/format'
import type { Worker } from '@/models/worker'
import { useEffect, useMemo, useState } from 'react'
import { listOrganizations, listPersons } from '@/api/refs'


function getOrg(row: any): any | null { return row?.organization ?? null }
function getOrgId(row: any): number | null { return (row?.organizationId ?? null) as number | null }
function getPerson(row: any): any | null { return row?.person ?? null }
function getPersonId(row: any): number | null { return (row?.personId ?? null) as number | null }
function getCoords(row: any): {x:any;y:any} | null { return row?.coordinates ?? null }

type Col<TRow> = {
    key: string
    title: string
    sortable?: boolean
    thClass?: string
    tdClass?: string
    render?: (value: any, row: TRow) => any
}

export default function WorkersPage(){
    const nav = useNavigate()
    const {
        items, total, loading, error,
        page, setPage, size, setSize,
        sortBy, setSortBy, sortDir, setSortDir,
        nameContains, setNameContains,
        minSalary, setMinSalary, maxSalary, setMaxSalary,
        refresh
    } = useWorkers()

    useRealtime(refresh, 5000)

    const [selected, setSelected] = useState<number[]>([])
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [bulkInfo, setBulkInfo] = useState<string | null>(null)

    const [orgNameById, setOrgNameById] = useState<Record<number, string>>({})
    const [perNameById, setPerNameById] = useState<Record<number, string>>({})
    const [perOrgUnnul, setPerOrgUnnul] = useState<Record<number, number>>({})


    useEffect(() => {
        let alive = true
        ;(async () => {
            try {
                const [orgs, persons] = await Promise.all([listOrganizations(), listPersons()])
                if (!alive) return

                const orgMap: Record<number,string> = {}
                for (const o of orgs) {
                    // пытаемся взять красивое имя: raw.orgName > raw.name > label без "#id — "
                    const raw = (o as any).raw ?? {}
                    const nice = raw.orgName ?? raw.name ?? String(o.label || '').replace(/^#\d+\s+—\s*/,'')
                    orgMap[o.id] = nice
                }
                const perMap: Record<number,string> = {}
                for (const p of persons) {
                    const raw = (p as any).raw ?? {}
                    const nice = raw.perName ?? raw.fullName ?? raw.name ?? String(p.label || '').replace(/^#\d+\s+—\s*/,'')
                    perMap[p.id] = nice
                }
                setOrgNameById(orgMap)
                setPerNameById(perMap)
                setPerOrgUnnul(perOrgUnnul)
            } catch {
            }
        })()
        return () => { alive = false }
    }, [])

    const toggleSort = (key: string) => {
        if (sortBy === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
        else { setSortBy(key); setSortDir('asc') }
    }

    const delOne = async (id: number) => {
        await deleteWorker(id)
        refresh()
    }

    const bulkDel = async () => {
        setBulkInfo(null)
        const ids = [...selected]
        setConfirmOpen(false)
        setSelected([])

        const results = await Promise.allSettled(ids.map(id => deleteWorker(id)))
        const ok = results.filter(r => r.status === 'fulfilled').length
        const fail = results.length - ok
        setBulkInfo(`Удалено: ${ok}. Ошибок: ${fail}.`)
        refresh()
    }

    useEffect(()=>{ setSelected([]) }, [page,size,items])

    const columns: Col<Worker>[] = useMemo(() => [
        { key: 'id', title: 'ID', sortable: true, thClass: 'w-[80px]', tdClass: 'text-right tabular-nums', render: (v:number)=>v },
        { key: 'name', title: 'Имя', sortable: true, thClass: 'min-w-[160px] w-[220px]', tdClass: 'truncate', render: (v:string)=>v ?? '—' },

        { key: 'salary', title: 'Зарплата', sortable: true, thClass: 'w-[140px]', tdClass: 'text-right tabular-nums', render: (v:number)=>fmtMoney(v) },
        { key: 'rating', title: 'Рейтинг', sortable: true, thClass: 'w-[110px]', tdClass: 'text-right tabular-nums', render: (v:number)=>v ?? '—' },
        { key: 'status', title: 'Статус', sortable: true, thClass: 'w-[130px]', tdClass: 'text-center', render: (v:string)=>v ?? '—' },

        { key: 'startDate', title: 'Начало', sortable: true, thClass: 'w-[170px]', tdClass: 'whitespace-nowrap text-right tabular-nums', render: (v:string)=>fmtDate(v) },
        { key: 'endDate', title: 'Окончание', sortable: true, thClass: 'w-[150px]', tdClass: 'whitespace-nowrap text-right tabular-nums', render: (v:string)=>v ?? '—' },

        { key: 'coordinates', title: 'Координаты', thClass: 'w-[150px] hidden md:table-cell', tdClass: 'whitespace-nowrap hidden md:table-cell text-center', render: (_:any, w:Worker) => {
                const c = getCoords(w)
                return c ? `x:${c.x} y:${c.y}` : '—'
            }
        },


        { key: 'orgName', title: 'Org Name', thClass: 'min-w-[180px] w-[220px]', tdClass: 'truncate', render: (_:any, w:Worker) => {
                const org = getOrg(w)
                const id = getOrgId(w)
                if (org?.orgName) return org.orgName
                if (id) return orgNameById[id] ?? `ID:${id}`
                return '—'
            }
        },
        { key: 'personName', title: 'Person Name', thClass: 'min-w-[180px] w-[220px]', tdClass: 'truncate', render: (_:any, w:Worker) => {
                const p = getPerson(w)
                const id = getPersonId(w)
                if (p?.perName) return p.perName
                if (id) return perNameById[id] ?? `ID:${id}`
                return '—'
            }
        },

        { key: 'organization', title: 'Организация', thClass: 'min-w-[220px] w-[280px]', tdClass: 'truncate', render: (_:any, w:Worker) => {
                const org = getOrg(w)
                const orgId = getOrgId(w)
                if (org) return `${org.type} • r:${org.rating} • emp:${org.employeesCount}`
                return orgId ? `ID:${orgId}` : '—'
            }
        },


        { key: 'person', title: 'Персона', thClass: 'min-w-[180px] w-[220px]', tdClass: 'truncate', render: (_:any, w:Worker) => {
                const p = getPerson(w)
                const pid = getPersonId(w)
                if (p) return p.passportID ? `passport: ${p.passportID}` : '—'
                return pid ? `ID:${pid}` : '—'
            }
        },

        { key: 'actions', title: '', thClass: 'w-[250px]', tdClass: 'whitespace-nowrap text-right', render: (_:any, w: Worker) => (
                <div className="flex items-center justify-end gap-2">
                    <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>nav(`/edit/${w.id}`)}>Изменить</button>
                    <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>nav(`/create?copy=${w.id}`)}>Дублировать</button>
                    <button className="px-2 py-1 rounded text-red-700 hover:bg-red-50" onClick={()=>delOne(w.id)}>Удалить</button>
                </div>
            ) },
    ], [sortBy, sortDir, orgNameById, perNameById])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Работники</h1>
                <div className="flex items-center gap-2">
                    <Link to="/create" className="btn-primary">+ Создать</Link>
                    {selected.length>0 && <button className="btn-danger" onClick={()=>setConfirmOpen(true)}>Удалить выбранные ({selected.length})</button>}
                </div>
            </div>

            <Filters
                name={nameContains}
                setName={setNameContains}
                minSalary={minSalary}
                setMinSalary={setMinSalary}
                maxSalary={maxSalary}
                setMaxSalary={setMaxSalary}
                onReset={()=>{ setNameContains(''); setMinSalary(undefined); setMaxSalary(undefined) }}
            />

            {error && <div className="error">{error}</div>}
            {loading && <div>Загрузка...</div>}
            {bulkInfo && <div className="text-sm text-gray-700">{bulkInfo}</div>}

            <div className="card p-0">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed border-collapse text-sm">
                        <thead className="sticky top-0 z-10 bg-white shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
                        <tr className="[&>th]:px-3 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold [&>th]:text-gray-600">
                            <th className="w-[44px]">
                                <input
                                    type="checkbox"
                                    onChange={(e)=>{
                                        if (e.target.checked) setSelected(items.map(i=>i.id))
                                        else setSelected([])
                                    }}
                                    checked={selected.length>0 && selected.length===items.length}
                                    aria-label="Выбрать все"
                                />
                            </th>
                            {columns.map(c=> (
                                <th key={c.key} className={c.thClass ?? ''}>
                                    {c.sortable ? (
                                        <button className="flex items-center gap-1 w-full" onClick={()=>toggleSort(c.key)}>
                                            <span className="truncate">{c.title}</span>
                                            {sortBy===c.key && <span className="text-xs">{sortDir==='asc'?'▲':'▼'}</span>}
                                        </button>
                                    ) : (
                                        <span className="truncate">{c.title}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="[&>tr]:border-b [&>tr]:border-gray-100">
                        {items.map((w, idx)=> (
                            <tr key={w.id} className={`${idx%2===1?'bg-gray-50/40':''} hover:bg-gray-50`}>
                                <td className="px-3 py-2.5 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(w.id)}
                                        onChange={(e)=>{
                                            setSelected(prev => e.target.checked ? [...prev, w.id] : prev.filter(id=>id!==w.id))
                                        }}
                                        aria-label={`Выбрать #${w.id}`}
                                    />
                                </td>
                                {columns.map(c=> (
                                    <td key={c.key} className={`px-3 py-2.5 align-middle ${c.tdClass ?? ''}`}>
                                        {c.render ? c.render((w as any)[c.key as keyof Worker], w) : String((w as any)[c.key as keyof Worker] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {items.length === 0 && !loading && (
                            <tr>
                                <td className="px-3 py-6 text-center text-gray-500" colSpan={columns.length + 1}>
                                    Ничего не найдено. Попробуйте изменить фильтры.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="px-3 py-2">
                    <Pagination page={page} size={size} total={total} onPage={setPage} onSize={setSize} />
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title={`Удалить ${selected.length} выбранных?`}
                onOk={bulkDel}
                onCancel={()=>setConfirmOpen(false)}
            />
        </div>
    )
}
