import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface AppState {
  // State
  isLoading: boolean
  toasts: Toast[]
  theme: 'light' | 'dark'
  language: 'es' | 'en'
  
  // Actions
  setLoading: (loading: boolean) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'es' | 'en') => void
  clearToasts: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isLoading: false,
        toasts: [],
        theme: 'light',
        language: 'es',

        // Actions
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading')
        },

        addToast: (toast) => {
          const id = Date.now().toString()
          const newToast = { ...toast, id }
          
          set(
            (state) => ({
              toasts: [...state.toasts, newToast],
            }),
            false,
            'addToast'
          )

          // Auto-remove toast after 5 seconds
          setTimeout(() => {
            get().removeToast(id)
          }, 5000)
        },

        removeToast: (id) => {
          set(
            (state) => ({
              toasts: state.toasts.filter((toast) => toast.id !== id),
            }),
            false,
            'removeToast'
          )
        },

        setTheme: (theme) => {
          set({ theme }, false, 'setTheme')
          
          // Apply theme to document
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark')
          }
        },

        setLanguage: (language) => {
          set({ language }, false, 'setLanguage')
        },

        clearToasts: () => {
          set({ toasts: [] }, false, 'clearToasts')
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }),
        skipHydration: true,
      }
    ),
    { name: 'AppStore' }
  )
)