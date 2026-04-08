import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — job data doesn't change often
      retry: 1, // One retry, then show error
      refetchOnWindowFocus: false, // Explicit refetches only
    },
    mutations: {
      retry: 0, // Never retry mutations
    },
  },
})
