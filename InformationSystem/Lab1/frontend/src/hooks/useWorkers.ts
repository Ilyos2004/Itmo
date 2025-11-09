import { useEffect, useMemo, useState } from 'react'
import { listWorkers } from '@/api/workers'
import type { Worker } from '@/models/worker'


export function useWorkers() {
    const [items, setItems] = useState<Worker[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [sortBy, setSortBy] = useState<string | undefined>()
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [nameContains, setNameContains] = useState<string>('')
    const [minSalary, setMinSalary] = useState<number | undefined>()
    const [maxSalary, setMaxSalary] = useState<number | undefined>()


    const params = useMemo(()=>({ page, size, sortBy, sortDir, nameContains, minSalary, maxSalary }), [page,size,sortBy,sortDir,nameContains,minSalary,maxSalary])


    const fetchAll = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await listWorkers(params)
            setItems(res.items)
            setTotal(res.total)
        } catch (e: any) {
            setError(e?.message || 'Не удалось загрузить работников')
        } finally {
            setLoading(false)
        }
    }


    useEffect(()=>{ fetchAll() }, [params.page, params.size, params.sortBy, params.sortDir, params.nameContains, params.minSalary, params.maxSalary])


    return {
        items, total, loading, error,
        page, setPage, size, setSize,
        sortBy, setSortBy, sortDir, setSortDir,
        nameContains, setNameContains,
        minSalary, setMinSalary, maxSalary, setMaxSalary,
        refresh: fetchAll
    }
}