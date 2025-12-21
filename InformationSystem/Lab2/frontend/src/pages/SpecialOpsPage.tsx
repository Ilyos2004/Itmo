import { useState } from 'react'
import { countByRating, startBefore, uniquePersons, fire, indexSalary } from '@/api/special'
import type { Worker } from '@/models/worker'
import { fmtMoney } from '@/utils/format'

export default function SpecialOpsPage() {

    const [rating, setRating] = useState<number>(5)
    const [count, setCount] = useState<number | null>(null)
    const [countLoading, setCountLoading] = useState(false)
    const [countError, setCountError] = useState<string | null>(null)


    const [ts, setTs] = useState<string>(new Date().toISOString())
    const [before, setBefore] = useState<Worker[] | null>(null)
    const [beforeLoading, setBeforeLoading] = useState(false)
    const [beforeError, setBeforeError] = useState<string | null>(null)


    const [persons, setPersons] = useState<number[] | null>(null)
    const [personsLoading, setPersonsLoading] = useState(false)
    const [personsError, setPersonsError] = useState<string | null>(null)

    const [fireId, setFireId] = useState<number | ''>('')
    const [fireLoading, setFireLoading] = useState(false)
    const [fireError, setFireError] = useState<string | null>(null)
    const [fireOk, setFireOk] = useState<string | null>(null)

    const [indexId, setIndexId] = useState<number | ''>('')
    const [factor, setFactor] = useState<number>(1.1)
    const [indexLoading, setIndexLoading] = useState(false)
    const [indexError, setIndexError] = useState<string | null>(null)
    const [indexOk, setIndexOk] = useState<string | null>(null)

    const doCount = async () => {
        setCountError(null); setCountLoading(true)
        try {
            const n = await countByRating(Number(rating))
            setCount(n)
        } catch (e: any) {
            setCountError(e?.response?.data?.message || e.message || 'Ошибка запроса')
        } finally {
            setCountLoading(false)
        }
    }

    const doBefore = async () => {
        setBeforeError(null); setBeforeLoading(true)
        try {
            const list = await startBefore(ts)
            setBefore(list)
        } catch (e: any) {
            setBeforeError(e?.response?.data?.message || e.message || 'Ошибка запроса')
        } finally {
            setBeforeLoading(false)
        }
    }

    const doPersons = async () => {
        setPersonsError(null); setPersonsLoading(true)
        try {
            const ids = await uniquePersons()
            setPersons(ids)
        } catch (e: any) {
            setPersonsError(e?.response?.data?.message || e.message || 'Ошибка запроса')
        } finally {
            setPersonsLoading(false)
        }
    }

    const doFire = async () => {
        setFireError(null); setFireOk(null); setFireLoading(true)
        try {
            if (fireId === '') return
            await fire(Number(fireId))
            setFireOk('Уволен успешно')
        } catch (e: any) {
            setFireError(e?.response?.data?.message || e.message || 'Ошибка запроса')
        } finally {
            setFireLoading(false)
        }
    }

    const doIndex = async () => {
        setIndexError(null); setIndexOk(null); setIndexLoading(true)
        try {
            if (indexId === '') return
            await indexSalary(Number(indexId), Number(factor))
            setIndexOk('Индексировано успешно')
        } catch (e: any) {
            setIndexError(e?.response?.data?.message || e.message || 'Ошибка запроса')
        } finally {
            setIndexLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <h1 className="text-2xl font-bold">Специальные операции (через функции БД)</h1>

            <div className="card grid md:grid-cols-3 gap-4">
                <div>
                    <label className="label">Рейтинг</label>
                    <input className="input" type="number" value={rating} onChange={e=>setRating(Number(e.target.value))} />
                    <button className="btn-primary mt-2" onClick={doCount} disabled={countLoading}>
                        {countLoading ? 'Запрос...' : 'Подсчитать'}
                    </button>
                    {countError && <div className="error mt-2">{countError}</div>}
                    {count!=null && <div className="mt-2">Количество: <b>{count}</b></div>}
                </div>


                <div>
                    <label className="label">StartDate до</label>
                    <input
                        className="input"
                        type="datetime-local"
                        value={new Date(ts).toISOString().slice(0,16)}
                        onChange={e=>setTs(new Date(e.target.value).toISOString())}
                    />
                    <button className="btn-primary mt-2" onClick={doBefore} disabled={beforeLoading}>
                        {beforeLoading ? 'Запрос...' : 'Найти'}
                    </button>
                    {beforeError && <div className="error mt-2">{beforeError}</div>}
                    {before && <div className="text-sm mt-2">Найдено: {before.length}</div>}
                </div>


                <div>
                    <div className="label">Уникальные person_id</div>
                    <button className="btn-primary w-full" onClick={doPersons} disabled={personsLoading}>
                        {personsLoading ? 'Запрос...' : 'Показать'}
                    </button>
                    {personsError && <div className="error mt-2">{personsError}</div>}
                    {persons && <div className="text-sm mt-2 break-all">[{persons.join(', ')}]</div>}
                </div>
            </div>

            <div className="card grid md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Уволить сотрудника</label>
                    <div className="grid grid-cols-3 gap-2">
                        <input className="input" placeholder="ID" value={fireId} onChange={e=>setFireId(e.target.value?Number(e.target.value):'')} />
                        <button className="btn-danger col-span-2" onClick={doFire} disabled={fireLoading}>
                            {fireLoading ? 'Выполняю...' : 'Fire'}
                        </button>
                    </div>
                    {fireError && <div className="error mt-2">{fireError}</div>}
                    {fireOk && <div className="text-green-600 text-sm mt-2">{fireOk}</div>}
                </div>

                <div>
                    <label className="label">Индексировать зарплату</label>
                    <div className="grid grid-cols-3 gap-2">
                        <input className="input" placeholder="ID" value={indexId} onChange={e=>setIndexId(e.target.value?Number(e.target.value):'')} />
                        <input className="input" type="number" step="0.01" value={factor} onChange={e=>setFactor(Number(e.target.value))} />
                        <button className="btn-primary" onClick={doIndex} disabled={indexLoading}>
                            {indexLoading ? 'Выполняю...' : 'OK'}
                        </button>
                    </div>
                    {indexError && <div className="error mt-2">{indexError}</div>}
                    {indexOk && <div className="text-green-600 text-sm mt-2">{indexOk}</div>}
                </div>
            </div>

            {before && before.length > 0 && (
                <div className="card">
                    <div className="text-sm text-gray-600 mb-3">Превью найденных работников (id, name, salary)</div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                            <tr>
                                <th className="th">ID</th>
                                <th className="th">Имя</th>
                                <th className="th">Зарплата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {before.map(w => (
                                <tr key={w.id}>
                                    <td className="td">{w.id}</td>
                                    <td className="td">{w.name}</td>
                                    <td className="td">{fmtMoney(w.salary)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
