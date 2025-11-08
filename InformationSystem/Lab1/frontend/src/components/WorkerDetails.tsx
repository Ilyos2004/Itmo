import type { Worker } from '@/models/worker'
import { fmtDate, fmtMoney } from '@/utils/format'

export default function WorkerDetails({ w }: { w: Worker | any }) {
    // поддержка обоих форматов ответа: вложенные объекты или *_Id
    const org = (w as any).organization ?? null
    const orgId = (w as any).organizationId ?? null

    const person = (w as any).person ?? null
    const personId = (w as any).personId ?? null

    const coords = (w as any).coordinates ?? null

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-3">Детали работника #{w.id}</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><b>Имя:</b> {w.name ?? '—'}</div>
                <div><b>Статус:</b> {w.status ?? '—'}</div>
                <div><b>Рейтинг:</b> {w.rating ?? '—'}</div>
                <div><b>Зарплата:</b> {fmtMoney(w.salary)}</div>
                <div><b>Создан:</b> {fmtDate(w.creationDate)}</div>
                <div><b>Начало:</b> {fmtDate(w.startDate)}</div>
                <div><b>Окончание:</b> {w.endDate ?? '—'}</div>
                <div><b>Координаты:</b> {coords ? <>x:{coords.x} y:{coords.y}</> : '—'}</div>
            </div>

            <h4 className="font-semibold mt-4">Организация</h4>
            {org ? (
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><b>Тип:</b> {org.type}</div>
                    <div><b>Рейтинг:</b> {org.rating}</div>
                    <div><b>Оборот:</b> {org.annualTurnover}</div>
                    <div><b>Сотр.:</b> {org.employeesCount}</div>
                    <div className="md:col-span-2"><b>Адрес:</b> {org.officialAddress?.street ?? '—'}</div>
                </div>
            ) : (
                <div className="text-sm text-gray-600">
                    {orgId ? <>Привязана организация ID: <b>{orgId}</b></> : '—'}
                </div>
            )}

            <h4 className="font-semibold mt-4">Персона</h4>
            {person ? (
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><b>Глаза:</b> {person.eyeColor ?? '—'}</div>
                    <div><b>Волосы:</b> {person.hairColor}</div>
                    <div><b>Рост:</b> {person.height ?? '—'}</div>
                    <div><b>Вес:</b> {person.weight ?? '—'}</div>
                    <div><b>Паспорт:</b> {person.passportID}</div>
                    <div><b>ДР:</b> {person.birthday}</div>
                    <div className="md:col-span-2">
                        <b>Локация:</b>{' '}
                        {person.location ? <>x:{person.location.x} y:{person.location.y} z:{person.location.z} ({person.location.name})</> : '—'}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-600">
                    {personId ? <>Привязана персона ID: <b>{personId}</b></> : '—'}
                </div>
            )}
        </div>
    )
}
