import { useEffect, useState } from 'react'
import type { Person } from '@/models/worker'
import { listPersons } from '@/api/refs'

type Props = {
    value: null | { mode: 'existing'; id: number } | { mode: 'new'; data: Person }
    onChange: (next: Props['value']) => void
}

export default function SelectOrCreatePerson({ value, onChange }: Props) {
    const [list, setList] = useState<{ id: number; label: string }[]>([])
    const enabled = true
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const effective = value ?? null

    useEffect(() => {
        (async () => {
            setError(null)
            try {
                const rows = await listPersons()
                setList(rows.map(p => ({ id: p.id, label: p.label })))
                if (enabled && effective?.mode === 'existing' && !(effective.id > 0) && rows.length) {
                    onChange({ mode: 'existing', id: rows[0].id })
                }
            } catch (e: any) {
                setError(e?.message || 'Не удалось загрузить персон')
            } finally {
                setLoaded(true)
            }
        })()
    }, [enabled])

    const ensureNew = (): Person => ({
        perName: '',              // ← добавлено
        eyeColor: null,
        hairColor: 'RED',
        location: { x: 0, y: 0, z: 0, name: '' },
        birthday: new Date().toISOString().slice(0, 16),
        passportID: '',
        height: null,
        weight: null,
    })

    return (
        <div className="space-y-3">
            <label className="flex items-center gap-2">

            </label>

            {!enabled ? null : (
                <>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={effective?.mode === 'existing'}
                                onChange={() => onChange({ mode: 'existing', id: list[0]?.id ?? 0 })}
                            />
                            <span>Выбрать существующую</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={effective?.mode === 'new'}
                                onChange={() => onChange({ mode: 'new', data: ensureNew() })}
                            />
                            <span>Создать новую</span>
                        </label>
                    </div>

                    {effective?.mode === 'existing' ? (
                        <div className="grid gap-2">
                            <label className="label">Person</label>
                            <select
                                className="select"
                                disabled={!loaded}
                                value={effective.id}
                                onChange={e => onChange({ mode: 'existing', id: Number(e.target.value) })}
                            >
                                {list.map(p => (
                                    <option key={p.id} value={p.id}>{p.label}</option>
                                ))}
                            </select>
                            {!loaded && <div className="text-sm text-gray-500">Загрузка...</div>}
                            {error && <div className="error">{error}</div>}
                            {loaded && !error && list.length === 0 && (
                                <div className="text-sm text-gray-500">Список пуст. Переключитесь на «Создать новую».</div>
                            )}
                        </div>
                    ) : effective?.mode === 'new' ? (
                        <div className="grid gap-3">
                            <div>
                                <label className="label">Per Name</label>
                                <input
                                    className="input"
                                    value={effective.data.perName ?? ''}
                                    onChange={e => onChange({ mode: 'new', data: { ...effective.data, perName: e.target.value } })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Паспорт*</label>
                                    <input
                                        className="input"
                                        value={effective.data.passportID}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, passportID: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="label">ДР*</label>
                                    <input
                                        className="input"
                                        type="datetime-local"
                                        value={effective.data.birthday}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, birthday: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Волосы*</label>
                                    <select
                                        className="select"
                                        value={effective.data.hairColor}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, hairColor: e.target.value as any } })}
                                    >
                                        <option value="RED">RED</option>
                                        <option value="BLUE">BLUE</option>
                                        <option value="WHITE">WHITE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Глаза</label>
                                    <select
                                        className="select"
                                        value={effective.data.eyeColor ?? ''}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, eyeColor: (e.target.value || null) as any } })}
                                    >
                                        <option value="">—</option>
                                        <option value="RED">RED</option>
                                        <option value="BLUE">BLUE</option>
                                        <option value="WHITE">WHITE</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <label className="label">Loc X*</label>
                                    <input
                                        className="input"
                                        type="number"
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, location: { ...effective.data.location, x: Number(e.target.value) } } })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Loc Y*</label>
                                    <input
                                        className="input"
                                        type="number"
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, location: { ...effective.data.location, y: Number(e.target.value) } } })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Loc Z*</label>
                                    <input
                                        className="input"
                                        type="number"
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, location: { ...effective.data.location, z: Number(e.target.value) } } })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Loc Name*</label>
                                    <input
                                        className="input"
                                        value={effective.data.location.name}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, location: { ...effective.data.location, name: e.target.value } } })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Рост</label>
                                    <input
                                        className="input"
                                        type="number"
                                        value={effective.data.height ?? ''}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, height: e.target.value ? Number(e.target.value) : null } })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Вес</label>
                                    <input
                                        className="input"
                                        type="number"
                                        value={effective.data.weight ?? ''}
                                        onChange={e => onChange({ mode: 'new', data: { ...effective.data, weight: e.target.value ? Number(e.target.value) : null } })}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    )
}
