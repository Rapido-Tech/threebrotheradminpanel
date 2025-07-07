import { useState, useCallback } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductDataset } from '@/data/types'
import { toast } from 'sonner'
import ProductDataSets from '@/components/ProductDataSets'

const API_URL = import.meta.env.VITE_API_URL

const getUnits = async (): Promise<ProductDataset[]> => {
  try {
    const response = await axios.get(`${API_URL}/unit`, {
      withCredentials: true,
    })
    return response.data.units
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

function Unit() {
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['unit'],
    queryFn: getUnits,
    refetchOnWindowFocus: false,
  })

  const deleteProductDataItem = useMutation({
    mutationFn: async ({ dataItemId }: { dataItemId: string }) => {
      try {
        const response = await axios.delete(`${API_URL}/unit/${dataItemId}`, {
          withCredentials: true,
        })
        return response.data
      } catch (error) {
        console.error('Error deleting unit:', error)
        if (axios.isAxiosError(error) && error.response?.data?.errorMessage) {
          throw error.response.data.errorMessage
        }
        throw new Error('Failed to delete unit')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit'] })
    },
  })

  const [openAddUnitModal, setOpenAddUnitModal] = useState<boolean>(false)

  const handleDeleteUnit = useCallback(
    async (dataItemId: string) => {
      const toastId = toast.loading('Deleting unit...')
      try {
        await deleteProductDataItem.mutateAsync({ dataItemId })
        toast.success('unit deleted successfully.', { id: toastId })
      } catch (err: any) {
        toast.error(err, { id: toastId })
        console.error('Error deleting unit:', err)
      }
    },
    [deleteProductDataItem]
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ProductDataSets
      setType='unit'
      data={units}
      onDelete={handleDeleteUnit}
      setOpenAddUnitModal={setOpenAddUnitModal}
      openAddUnitModal={openAddUnitModal}
    />
  )
}

export default Unit
