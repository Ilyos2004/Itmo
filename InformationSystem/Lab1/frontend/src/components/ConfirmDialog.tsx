export default function ConfirmDialog({ open, title, text, onOk, onCancel }:{
    open: boolean; title: string; text?: string; onOk: ()=>void; onCancel: ()=>void
}){
    if(!open) return null
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="card max-w-md w-full">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {text && <p className="text-gray-600 mb-4">{text}</p>}
                <div className="flex justify-end gap-2">
                    <button className="btn-ghost" onClick={onCancel}>Отмена</button>
                    <button className="btn-danger" onClick={onOk}>Удалить</button>
                </div>
            </div>
        </div>
    )
}