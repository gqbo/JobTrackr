import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import { queryClient } from '@/lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <h1 className="text-2xl font-bold p-4">JobTrackr</h1>
          {/* Routes will be added in Sprint 1B */}
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
