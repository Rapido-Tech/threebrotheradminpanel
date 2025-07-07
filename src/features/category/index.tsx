import { useState, useCallback } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductDataset } from '@/data/types'
import { toast } from 'sonner'
import ProductDataSets from '@/components/ProductDataSets'

const API_URL = import.meta.env.VITE_API_URL

const getCategories = async (): Promise<ProductDataset[]> => {
  try {
    const response = await axios.get(`${API_URL}/category`, {
      withCredentials: true,
    })
    return response.data.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

function Category() {
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['category'],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  })

  const deleteProductDataItem = useMutation({
    mutationFn: async ({ dataItemId }: { dataItemId: string }) => {
      try {
        const response = await axios.delete(
          `${API_URL}/category/${dataItemId}`,
          {
            withCredentials: true,
          }
        )
        return response.data
      } catch (error) {
        console.error('Error deleting category:', error)
        if (axios.isAxiosError(error) && error.response?.data?.errorMessage) {
          throw error.response.data.errorMessage
        }
        throw new Error('Failed to delete category')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
    },
  })

  const [openAddCategoryModal, setOpenAddCategoryModal] =
    useState<boolean>(false)

  const handleDeleteCategory = useCallback(
    async (dataItemId: string) => {
      const toastId = toast.loading('Deleting category...')
      try {
        await deleteProductDataItem.mutateAsync({ dataItemId })
        toast.success('Category deleted successfully.', { id: toastId })
      } catch (err: any) {
        toast.error(err, { id: toastId })
        console.error('Error deleting category:', err)
      }
    },
    [deleteProductDataItem]
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ProductDataSets
      setType='category'
      data={categories}
      onDelete={handleDeleteCategory}
      setOpenAddUnitModal={setOpenAddCategoryModal}
      openAddUnitModal={openAddCategoryModal}
    />
  )
}

export default Category
