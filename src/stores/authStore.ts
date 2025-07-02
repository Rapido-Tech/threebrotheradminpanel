// stores/authStore.ts
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  _id: string
  firstname: string
  lastname: string
  email?: string
  username: string
  avatar: string
  phone?: string
  country?: string
  subscriberPackage: string
  isVerified: boolean
  settings: any
  storeIds: string[]
  defaultShopId: string | null
  taxPin?: string | null
  createdAt: Date
  updatedAt: Date
}

interface AuthState {
  user: AuthUser | null
  isLoggedIn: boolean
  setUser: (user: AuthUser | null) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user) => {
        set({
          user,
          isLoggedIn: !!user,
        })
      },

      reset: () => {
        Cookies.remove('token')
        set({ user: null, isLoggedIn: false })
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)
