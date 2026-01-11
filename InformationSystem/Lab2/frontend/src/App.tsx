import { Link, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { useAuth } from '@/auth/AuthContext'

import WorkersPage from '@/pages/WorkersPage'
import WorkerCreatePage from '@/pages/WorkerCreatePage'
import WorkerEditPage from '@/pages/WorkerEditPage'
import SpecialOpsPage from '@/pages/SpecialOpsPage'
import ImportPage from '@/pages/ImportPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

function TopBar() {
    const { user, logout } = useAuth()

    const username = user?.username ?? user?.login ?? user?.name ?? ''
    const roles = (user?.roles ?? (user?.role ? [user.role] : [])).join(', ')

    return (
        <div className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="font-semibold">Workers</Link>
                    <Link to="/special" className="text-sm text-gray-700 hover:underline">Special Ops</Link>
                    <Link to="/import" className="text-sm text-gray-700 hover:underline">Import</Link>
                </div>

                <div className="flex items-center gap-3">
                    {username ? (
                        <>
                            <div className="text-sm text-gray-600">
                                {username} {roles ? <span className="text-gray-400">({roles})</span> : null}
                            </div>
                            <button className="px-3 py-1 rounded hover:bg-gray-100" onClick={()=>logout()}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-sm underline">Войти</Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />

            <div className="max-w-6xl mx-auto px-4 py-4">
                <Routes>
                    {/* публичные */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* защищённые */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<WorkersPage />} />
                        <Route path="/create" element={<WorkerCreatePage />} />
                        <Route path="/edit/:id" element={<WorkerEditPage />} />
                        <Route path="/special" element={<SpecialOpsPage />} />
                        <Route path="/import" element={<ImportPage />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )
}
