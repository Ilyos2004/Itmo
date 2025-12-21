import { ReactNode } from 'react'


type Col<T> = { key: keyof T | string; title: string; render?: (v: any, row: T) => ReactNode; sortable?: boolean }


export default function Table<T extends { id: number }>({ columns, data, onSort, sortBy, sortDir }: {
    columns: Col<T>[]
    data: T[]
    onSort?: (key: string) => void
    sortBy?: string
    sortDir?: 'asc' | 'desc'
}) {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                <tr>
                    {columns.map(c=> (
                        <th className="th" key={String(c.key)}>
                            <button className="flex items-center gap-1" onClick={()=>c.sortable && onSort?.(String(c.key))}>
                                <span>{c.title}</span>
                                {c.sortable && sortBy===c.key && (<span>{sortDir==='asc'?'▲':'▼'}</span>)}
                            </button>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                        {columns.map(c => (
                            <td className="td" key={String(c.key)}>
                                {c.render ? c.render((row as any)[c.key as any], row) : String((row as any)[c.key as any] ?? '—')}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}