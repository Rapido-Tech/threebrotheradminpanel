import { createContext, ReactNode, useContext, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { ShopData } from '../data/schema'

interface ShopContextState {
  shopData: ShopData | null
  setShopData: (shopData: ShopData | null) => void
  isLoadingShopData: boolean
  setIsLoadingShopData: Dispatch<SetStateAction<boolean>>
}

interface UserContextProps {
  children: ReactNode
}

const ShopContext = createContext<ShopContextState | undefined>(undefined)

export const useShopContext = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShopContext must be used within a AuthProvider')
  }
  return context
}

export const ShopProvider = ({ children }: UserContextProps) => {
  const [shopData, setShopData] = useState<ShopData | null>(null)
  const [isLoadingShopData, setIsLoadingShopData] = useState<boolean>(true)

  return (
    <ShopContext.Provider
      value={{
        shopData,
        setShopData,
        isLoadingShopData,
        setIsLoadingShopData,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
