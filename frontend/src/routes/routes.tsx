import { Navigate, type RouteObject } from 'react-router-dom'

import { ProtectedLayout } from '@/components/ProtectedLayout'
import { DashboardLayout } from '@/components/DashboardLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ApplicationsPage } from '@/pages/ApplicationsPage'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fcf8f9] flex items-center justify-center">
      <div className="text-center">
        <p className="font-display font-semibold text-[#323235] text-2xl">404</p>
        <p className="mt-2 font-body text-[#5f5f61]">Page not found</p>
      </div>
    </div>
  )
}

export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <ApplicationsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
