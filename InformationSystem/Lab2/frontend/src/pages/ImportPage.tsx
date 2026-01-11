import { useEffect, useState } from 'react'
import { getImportHistory, importWorkers, type ImportHistoryItem } from '@/api/import'

function badgeClass(status: string) {
    const s = (status || '').toUpperCase()
    if (s.includes('SUCCESS')) return 'bg-green-100 text-green-800'
    if (s.includes('FAIL')) return 'bg-red-100 text-red-800'
    if (s.includes('RUN') || s.includes('PEND')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-700'
}

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null)
    const [busy, setBusy] = useState(false)
    const [info, setInfo] = useState<string | null>(null)

    const [history, setHistory] = useState<ImportHistoryItem[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)

    const loadHistory = async () => {
        setLoadingHistory(true)
        try {
            const list = await getImportHistory()
            setHistory(list)
        } finally {
            setLoadingHistory(false)
        }
    }

    useEffect(() => {
        loadHistory()
        const t = setInterval(loadHistory, 5000) 
        return () => clearInterval(t)
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setInfo(null)
        if (!file) {
            alert('Выберите файл для импорта')
            return
        }
        setBusy(true)
        try {
            const res = await importWorkers(file)
            if (res && typeof res === 'object') {
                const id = (res as any).id ?? (res as any).operationId
                const status = (res as any).status
                setInfo(id ? `Импорт запущен. Operation ID: ${id}${status ? ` (${status})` : ''}` : 'Импорт запущен.')
            } else {
                setInfo('Импорт запущен.')
            }
            setFile(null)
            const input = document.getElementById('import-file') as HTMLInputElement | null
            if (input) input.value = ''
            await loadHistory()
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Импорт Workers</h1>
                <button className="px-3 py-1 rounded hover:bg-gray-100" onClick={loadHistory} disabled={loadingHistory}>
                    {loadingHistory ? 'Обновляю...' : 'Обновить историю'}
                </button>
            </div>

            <div className="card space-y-3">
                <div className="text-sm text-gray-600">
                </div>

                <form onSubmit={submit} className="flex flex-col md:flex-row gap-3 md:items-end">
                    <div className="flex-1">
                        <label className="label">Файл</label>
                        <input
                            id="import-file"
                            className="input"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                        </div>
                    </div>

                    <button className="btn-primary md:w-[200px]" disabled={busy}>
                        {busy ? 'Загрузка...' : 'Импортировать'}
                    </button>
                </form>

                {info && <div className="text-sm text-gray-700">{info}</div>}
            </div>

            <div className="card p-0">
                <div className="px-4 py-3 border-b font-semibold">История импортов</div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-white sticky top-0">
                        <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold [&>th]:text-gray-600 border-b">
                            <th className="w-[90px]">ID</th>
                            <th className="w-[140px]">Статус</th>
                            <th className="min-w-[180px]">Пользователь</th>
                            <th className="w-[140px] text-right">Добавлено</th>
                        </tr>
                        </thead>
                        <tbody className="[&>tr]:border-b [&>tr]:border-gray-100">
                        {history.map((h, idx) => (
                            <tr key={h.id} className={`${idx % 2 ? 'bg-gray-50/40' : ''} hover:bg-gray-50`}>
                                <td className="px-4 py-2.5 tabular-nums">{h.id}</td>
                                <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${badgeClass(String(h.status))}`}>
                      {String(h.status)}
                    </span>
                                </td>
                                <td className="px-4 py-2.5">{h.username ?? '—'}</td>
                                <td className="px-4 py-2.5 text-right tabular-nums">
                                    {String(h.status).toUpperCase().includes('SUCCESS')
                                        ? (h.addedCount ?? 0)
                                        : '—'}
                                </td>
                            </tr>
                        ))}

                        {history.length === 0 && !loadingHistory && (
                            <tr>
                                <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                                    История пуста.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {loadingHistory && <div className="px-4 py-3 text-sm text-gray-500">Загрузка истории...</div>}
            </div>
        </div>
    )
}
