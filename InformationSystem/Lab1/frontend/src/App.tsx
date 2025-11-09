import { Link, NavLink, useLocation } from 'react-router-dom'
import RoutesView from './routes'


export default function App() {
    const { pathname } = useLocation()
    return (
        <div>
            <header className="bg-white border-b">
                <div className="container flex items-center justify-between py-4">
                    <Link to="/" className="text-xl font-bold">Workers Project</Link>
                    <nav className="flex gap-4">
                        <NavLink to="/" className={({isActive})=>isActive? 'font-semibold' : ''}>Список</NavLink>
                        <NavLink to="/create" className={({isActive})=>isActive? 'font-semibold' : ''}>Создать</NavLink>
                        <NavLink to="/special" className={({isActive})=>isActive? 'font-semibold' : ''}>Спец.операции</NavLink>
                    </nav>
                </div>
            </header>
            <main className="container py-6">
                <RoutesView key={pathname} />
            </main>
        </div>
    )
}