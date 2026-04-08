import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '@/contexts/AuthContext'
import { queryClient } from '@/lib/queryClient'
import { LoginPage } from '@/pages/LoginPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* Protected routes — Sprint 1B */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-[#fcf8f9] flex items-center justify-center">
                  <p className="font-body text-[#5f5f61]">Dashboard — coming in Sprint 2</p>
                </div>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
