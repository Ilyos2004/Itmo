import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, logout } = useAuth()

    return (
        <div className="min-h-screen">
            <header className="border-b bg-white">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="font-bold">Workers</Link>
                        {user && (
                            <>
                                <Link className="btn-ghost" to="/">Таблица</Link>
                                <Link className="btn-ghost" to="/special">Спец. операции</Link>
                                {isAdmin && <Link className="btn-ghost" to="/create">+ Создать</Link>}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!user ? (
                            <Link className="btn-primary" to="/login">Войти</Link>
                        ) : (
                            <>
                <span className="text-sm text-gray-700">
                  {user.username} • {isAdmin ? 'ADMIN' : 'USER'}
                </span>
                                <button className="btn-danger" onClick={logout}>Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )
}
