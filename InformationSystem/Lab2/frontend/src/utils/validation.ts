import type { WorkerInput } from '@/models/worker'

export function validateWorker(input: WorkerInput) {
    const errors: Record<string, string> = {}
    const req = (cond: boolean, key: string, msg: string) => { if (!cond) errors[key] = msg }

    req(!!input.name && String(input.name).trim().length > 0, 'name', 'Имя обязательно')
    req(!!input.coordinates, 'coordinates', 'Координаты обязательны')
    req(input?.coordinates?.y != null, 'coordinates.y', 'Y не может быть null')
    req(Number(input.salary) > 0, 'salary', 'Зарплата > 0')
    if (input.rating != null) req(Number(input.rating) > 0, 'rating', 'Рейтинг > 0')
    req(!!input.startDate, 'startDate', 'Дата начала обязательна')

    if (input.organization?.mode === 'existing') {
        req(Number(input.organization.id) > 0, 'organization.id', 'Выберите организацию')
    } else if (input.organization?.mode === 'new') {
        const org = input.organization.data
        req(!!org, 'organization', 'Организация обязательна')
        req(Number(org?.annualTurnover) > 0, 'organization.annualTurnover', 'Оборот > 0')
        req(Number(org?.employeesCount) > 0, 'organization.employeesCount', 'Сотрудников > 0')
        req(Number(org?.rating) > 0, 'organization.rating', 'Рейтинг > 0')
        req(!!org?.type, 'organization.type', 'Тип обязателен')
    } else {
        errors['organization'] = 'Организация обязательна'
    }

    if (input.person) {
        if (input.person.mode === 'existing') {
            req(Number(input.person.id) > 0, 'person.id', 'Выберите персону')
        } else if (input.person.mode === 'new') {
            const p = input.person.data
            req(!!p.hairColor, 'person.hairColor', 'Цвет волос обязателен')
            req(!!p.location, 'person.location', 'Локация обязательна')
            req(!!p.birthday, 'person.birthday', 'ДР обязателен')
            req(!!p.passportID && String(p.passportID).trim().length > 0 && String(p.passportID).length <= 47, 'person.passportID', 'Паспорт обязателен, длина ≤ 47')
            if (p.height != null) req(Number(p.height) > 0, 'person.height', 'Рост > 0')
            if (p.weight != null) req(Number(p.weight) > 0, 'person.weight', 'Вес > 0')
            req(p.location?.x != null, 'person.location.x', 'Loc X обязателен')
            req(p.location?.y != null, 'person.location.y', 'Loc Y обязателен')
            req(p.location?.z != null, 'person.location.z', 'Loc Z обязателен')
            req(!!p.location?.name, 'person.location.name', 'Loc Name обязателен')
        }
    }

    return errors
}
