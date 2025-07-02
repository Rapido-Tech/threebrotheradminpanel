// stores/shopStore.ts
import { ShopData } from '@/data/types'
import { create } from 'zustand'

interface ShopState {
  shopData: ShopData | null
  setShopData: (shopData: ShopData | null) => void
  activeShopId: string | null
  setActiveShopId: (shopId: string) => void
  reset: () => void
}

export const useShopStore = create<ShopState>((set) => ({
  shopData: null,

  setShopData: (shopData) => set({ shopData }),

  activeShopId: localStorage.getItem('activeShopId') || null,

  setActiveShopId: (shopId: string) => {
    localStorage.setItem('activeShopId', shopId)
    set({ activeShopId: shopId })
  },

  reset: () => {
    set({ activeShopId: null })
  },
}))
