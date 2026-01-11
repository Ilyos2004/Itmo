export default function Pagination({ page, size, total, onPage, onSize }:{
    page: number
    size: number
    total: number
    onPage: (p:number)=>void
    onSize: (s:number)=>void
}){
    const pages = Math.max(1, Math.ceil(total / size))
    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Всего: {total}</div>
            <div className="flex items-center gap-2">
                <button className="btn-ghost" onClick={()=>onPage(Math.max(1, page-1))} disabled={page===1}>Назад</button>
                <span className="text-sm">{page}/{pages}</span>
                <button className="btn-ghost" onClick={()=>onPage(Math.min(pages, page+1))} disabled={page===pages}>Вперёд</button>
                <select className="select" value={size} onChange={e=>onSize(Number(e.target.value))}>
                    {[5,10,20,50].map(n=> <option key={n} value={n}>{n}/стр</option>)}
                </select>
            </div>
        </div>
    )
}