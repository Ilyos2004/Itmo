import { useRoutes } from 'react-router-dom'
import WorkersPage from './pages/WorkersPage'
import WorkerCreatePage from './pages/WorkerCreatePage'
import WorkerEditPage from './pages/WorkerEditPage'
import SpecialOpsPage from './pages/SpecialOpsPage'


export default function RoutesView() {
    return useRoutes([
        { path: '/', element: <WorkersPage /> },
        { path: '/create', element: <WorkerCreatePage /> },
        { path: '/edit/:id', element: <WorkerEditPage /> },
        { path: '/special', element: <SpecialOpsPage /> },
    ])
}