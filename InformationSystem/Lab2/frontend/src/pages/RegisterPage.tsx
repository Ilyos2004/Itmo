import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export default function RegisterPage() {
  const nav = useNavigate()
  const { register } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setOk(null)
    setBusy(true)
    try {
      await register(username, password) // без роли
      setOk('Аккаунт создан. Теперь войдите.')
      setTimeout(() => nav('/login', { replace: true }), 400)
    } catch (e: any) {
      console.log('[ui] register failed:', e)
      setErr(e?.response?.data?.message || e?.message || 'Ошибка регистрации')
    } finally {
      setBusy(false)
    }
  }

  return (
      <div className="max-w-md mx-auto mt-10 space-y-4">
        <h1 className="text-2xl font-bold">Регистрация</h1>

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
          {ok && <div className="text-green-700 text-sm">{ok}</div>}

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? '...' : 'Зарегистрироваться'}
          </button>

          <div className="text-sm text-gray-600">
            Уже есть аккаунт? <Link className="underline" to="/login">Войти</Link>
          </div>
        </form>
      </div>
  )
}
