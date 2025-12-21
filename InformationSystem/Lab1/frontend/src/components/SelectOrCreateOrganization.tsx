import { useEffect, useState } from 'react'
import type { Organization } from '@/models/worker'
import { listOrganizations } from '@/api/refs'

type Props = {
    value: { mode: 'existing'; id: number } | { mode: 'new'; data: Organization }
    onChange: (next: Props['value']) => void
}

export default function SelectOrCreateOrganization({ value, onChange }: Props) {
    const [list, setList] = useState<{ id: number; label: string }[]>([])
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            setError(null)
            try {
                const rows = await listOrganizations()
                setList(rows.map(r => ({ id: r.id, label: r.label })))
                if (rows.length && value.mode === 'existing' && !value.id) {
                    onChange({ mode: 'existing', id: rows[0].id })
                }
            } catch (e: any) {
                setError(e?.message || 'Не удалось загрузить организации')
            } finally {
                setLoaded(true)
            }
        })()
    }, [])

    return (
        <div className="space-y-3">
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={value.mode === 'existing'}
                        onChange={() => onChange({ mode: 'existing', id: list[0]?.id ?? 0 })}
                    />
                    <span>Выбрать существующую</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={value.mode === 'new'}
                        onChange={() =>
                            onChange({
                                mode: 'new',
                                data: {
                                    orgName: '',
                                    officialAddress: { street: '' },
                                    annualTurnover: 1,
                                    employeesCount: 1,
                                    rating: 1,
                                    type: 'COMMERCIAL',
                                } as Organization,
                            })
                        }
                    />
                    <span>Создать новую</span>
                </label>
            </div>

            {value.mode === 'existing' ? (
                <div className="grid gap-2">
                    <label className="label">Организация</label>
                    <select
                        className="select"
                        disabled={!loaded}
                        value={value.id}
                        onChange={e => onChange({ mode: 'existing', id: Number(e.target.value) })}
                    >
                        {list.map(o => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                    </select>
                    {!loaded && <div className="text-sm text-gray-500">Загрузка...</div>}
                    {error && <div className="error">{error}</div>}
                    {loaded && !error && list.length === 0 && (
                        <div className="text-sm text-gray-500">Список пуст. Переключитесь на «Создать новую».</div>
                    )}
                </div>
            ) : (
                <div className="grid gap-3">
                    <div>
                        <label className="label">Org Name</label>
                        <input
                            className="input"
                            value={value.data.orgName ?? ''}
                            onChange={e => onChange({ mode: 'new', data: { ...value.data, orgName: e.target.value } })}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="label">Оборот*</label>
                            <input
                                className="input"
                                type="number"
                                onChange={e => onChange({ mode: 'new', data: { ...value.data, annualTurnover: Number(e.target.value) } })}
                            />
                        </div>
                        <div>
                            <label className="label">Сотр.*</label>
                            <input
                                className="input"
                                type="number"
                                onChange={e => onChange({ mode: 'new', data: { ...value.data, employeesCount: Number(e.target.value) } })}
                            />
                        </div>
                        <div>
                            <label className="label">Рейтинг*</label>
                            <input
                                className="input"
                                type="number"
                                onChange={e => onChange({ mode: 'new', data: { ...value.data, rating: Number(e.target.value) } })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Тип*</label>
                        <select
                            className="select"
                            value={value.data.type}
                            onChange={e => onChange({ mode: 'new', data: { ...value.data, type: e.target.value as Organization['type'] } })}
                        >
                            <option value="COMMERCIAL">COMMERCIAL</option>
                            <option value="GOVERNMENT">GOVERNMENT</option>
                            <option value="PRIVATE_LIMITED_COMPANY">PRIVATE_LIMITED_COMPANY</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Улица</label>
                        <input
                            className="input"
                            value={value.data.officialAddress?.street ?? ''}
                            onChange={e =>
                                onChange({
                                    mode: 'new',
                                    data: { ...value.data, officialAddress: { street: e.target.value } },
                                })
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
