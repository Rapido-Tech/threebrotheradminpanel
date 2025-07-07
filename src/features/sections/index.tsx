import { useState, useCallback } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductDataset } from '@/data/types'
import { toast } from 'sonner'
import ProductDataSets from '@/components/ProductDataSets'

const API_URL = import.meta.env.VITE_API_URL

const getSections = async (): Promise<ProductDataset[]> => {
  try {
    const response = await axios.get(`${API_URL}/section`, {
      withCredentials: true,
    })
    return response.data.sections
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

function Section() {
  const queryClient = useQueryClient()

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['section'],
    queryFn: getSections,
    refetchOnWindowFocus: false,
  })

  const deleteProductDataItem = useMutation({
    mutationFn: async ({ dataItemId }: { dataItemId: string }) => {
      try {
        const response = await axios.delete(
          `${API_URL}/section/${dataItemId}`,
          {
            withCredentials: true,
          }
        )
        return response.data
      } catch (error) {
        console.error('Error deleting section:', error)
        if (axios.isAxiosError(error) && error.response?.data?.errorMessage) {
          throw error.response.data.errorMessage
        }
        throw new Error('Failed to delete section')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section'] })
    },
  })

  const [openAddSectionModal, setOpenAddSectionModal] = useState<boolean>(false)

  const handleDeleteSection = useCallback(
    async (dataItemId: string) => {
      const toastId = toast.loading('Deleting section...')
      try {
        await deleteProductDataItem.mutateAsync({ dataItemId })
        toast.success('Section deleted successfully.', { id: toastId })
      } catch (err: any) {
        toast.error(err, { id: toastId })
        console.error('Error deleting section:', err)
      }
    },
    [deleteProductDataItem]
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ProductDataSets
      setType='section'
      data={sections}
      onDelete={handleDeleteSection}
      setOpenAddUnitModal={setOpenAddSectionModal}
      openAddUnitModal={openAddSectionModal}
    />
  )
}

export default Section
