import { useState, useMemo } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useShopStore } from '@/stores/shopStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ShopData } from './data/schema'

const API_URL = import.meta.env.VITE_API_URL

// Function to fetch all shops
const getAllShops = async (id: string) => {
  return axios
    .get(`${API_URL}/store/${id}/get-all`, { withCredentials: true })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to fetch shops')
    })
}

export default function ShopSelector() {
  const user = useAuthStore((state) => state.user)
  const { activeShopId, setActiveShopId } = useShopStore()

  const [selectedShop, setSelectedShop] = useState<string | null>(activeShopId)

  const {
    data: shops,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['shops'],
    queryFn: () => {
      if (!activeShopId) {
        throw new Error('No active shop ID found')
      }
      return getAllShops(activeShopId)
    },
    enabled: !!user, // Prevent query from running if user is not available
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  })

  // Use memoization for available shops to avoid unnecessary recalculations
  const availableShops = useMemo(() => shops?.shopSummaries || [], [shops])

  const handleShopSelect = (shopId: string) => {
    if (selectedShop !== shopId) {
      setSelectedShop(shopId)
      setActiveShopId(shopId)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading shops.</div>
  }

  return (
    <div className='mx-auto w-full max-w-3xl p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex items-center'>
          <Store className='mr-2 h-8 w-8 text-primary' />
          <h2 className='text-2xl font-bold tracking-tight'>Select a Shop</h2>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {availableShops.map((shop: ShopData) => {
          const userPermission = shop.userPermissions?.find(
            (permission) => permission.userId === user?._id
          )

          return (
            <Card
              key={shop._id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedShop === shop._id ? 'border-2 border-primary' : ''}`}
              onClick={() => handleShopSelect(shop._id)}
            >
              <CardContent className='p-4'>
                <div className='relative mb-4 aspect-square overflow-hidden rounded-lg'>
                  {shop.shopName && (
                    <Avatar className='h-full w-full'>
                      <AvatarFallback>
                        {getInitials(shop.shopName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className='text-center'>
                  <h3 className='mb-1 font-medium'>{shop.shopName}</h3>
                  <p className='text-sm capitalize text-muted-foreground'>
                    {userPermission ? (
                      <>Active - {userPermission.role}</>
                    ) : (
                      'No permissions assigned'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
