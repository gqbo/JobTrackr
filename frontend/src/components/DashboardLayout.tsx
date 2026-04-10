import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#fdf9fa]">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#fdf9fa]">
        <Outlet />
      </main>
    </div>
  )
}
