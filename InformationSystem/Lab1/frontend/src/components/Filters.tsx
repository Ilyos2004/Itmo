export default function Filters({ name, setName, minSalary, setMinSalary, maxSalary, setMaxSalary, onReset }:{
    name: string; setName: (v:string)=>void
    minSalary?: number; setMinSalary: (v:number|undefined)=>void
    maxSalary?: number; setMaxSalary: (v:number|undefined)=>void
    onReset: ()=>void
}){
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
                <label className="label">Имя (поиск по части)</label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="например, ан" />
            </div>
            <div>
                <label className="label">Зарплата от</label>
                <input className="input" type="number" value={minSalary ?? ''} onChange={e=>setMinSalary(e.target.value?Number(e.target.value):undefined)} />
            </div>
            <div>
                <label className="label">Зарплата до</label>
                <input className="input" type="number" value={maxSalary ?? ''} onChange={e=>setMaxSalary(e.target.value?Number(e.target.value):undefined)} />
            </div>
            <div className="flex items-end">
                <button className="btn-ghost" onClick={onReset}>Сбросить</button>
            </div>
        </div>
    )
}