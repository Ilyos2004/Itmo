import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export default function ProtectedRoute() {
    const { isLoading, isAuthed } = useAuth()

    if (isLoading) return <div className="p-4">Загрузка...</div>
    if (!isAuthed) return <Navigate to="/login" replace />

    return <Outlet />
}
