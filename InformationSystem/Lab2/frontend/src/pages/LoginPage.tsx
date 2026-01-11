import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export default function LoginPage() {
    const nav = useNavigate()
    const { login } = useAuth()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErr(null)
        setBusy(true)
        try {
            await login(username, password)
            nav('/', { replace: true })
        } catch (e: any) {
            console.log('[ui] login failed:', e)
            setErr(e?.response?.data?.message || e?.message || 'Ошибка логина')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Вход</h1>

            <form onSubmit={submit} className="card space-y-3">
                <div>
                    <label className="label">Username</label>
                    <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="label">Password</label>
                    <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                </div>

                {err && <div className="error">{err}</div>}

                <button className="btn-primary w-full" disabled={busy}>
                    {busy ? '...' : 'Войти'}
                </button>

                <div className="text-sm text-gray-600">
                    Нет аккаунта? <Link className="underline" to="/register">Регистрация</Link>
                </div>
            </form>
        </div>
    )
}
