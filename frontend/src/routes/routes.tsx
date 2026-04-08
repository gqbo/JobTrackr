import { type RouteObject } from 'react-router-dom'

import { ProtectedLayout } from '@/components/ProtectedLayout'
import { LoginPage } from '@/pages/LoginPage'

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
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: (
          <div className="min-h-screen bg-[#fcf8f9] flex items-center justify-center">
            <p className="font-body text-[#5f5f61]">Dashboard — coming in Sprint 2</p>
          </div>
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
