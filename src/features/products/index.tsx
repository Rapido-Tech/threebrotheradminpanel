import { useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { DataTable } from './components/data-table'
import { columns } from './components/product-columns'
import { ProductModal } from './components/product-modal'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import ProductsProvider from './context/products-context'
import { SavedProduct } from './data/schema'

const API_URL = import.meta.env.VITE_API_URL

const getProductsPagination = async (
  page: number = 1,
  limit: number = 10,
  type?: 'shop' | 'warehouse'
): Promise<any[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (type) params.append('type', type)

  try {
    const response = await axios.get(
      `${API_URL}/product/?${params.toString()}`,
      { withCredentials: true }
    )
    return response.data.products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

const fetchProductById = async (productId: string) => {
  const response = await axios.get(`${API_URL}/product/${productId}`, {
    withCredentials: true,
  })
  if (response.status !== 200) throw new Error('Failed to get product.')
  return response.data.product
}

interface ProductImage {
  url: string
  publicId: string
  isMain: boolean
  file?: File // optional, only present for new images
}

export default function Products() {
  const [sort, setSort] = useState<'ascending' | 'descending'>('ascending')
  const [limit] = useState(10)
  const [type] = useState<'shop' | 'warehouse' | undefined>(undefined)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', limit, type],
    queryFn: () => getProductsPagination(1, limit, type),
    refetchOnWindowFocus: false,
  })

  const queryClient = useQueryClient()

  const updateProduct = useMutation({
    mutationFn: async ({
      productId,
      originalProduct,
      editedProduct,
    }: {
      productId: string
      originalProduct: SavedProduct
      editedProduct: any
    }) => {
      const formData = new FormData()

      // Helper to check for changes
      type ProductField = keyof SavedProduct

      const hasChanged = (key: ProductField) =>
        JSON.stringify(editedProduct[key]) !==
        JSON.stringify(originalProduct[key])

      if (hasChanged('productName'))
        formData.append('productName', editedProduct.productName)
      if (hasChanged('description'))
        formData.append('description', editedProduct.description)
      if (hasChanged('buyingPrice'))
        formData.append('buyingPrice', editedProduct.buyingPrice.toString())
      if (hasChanged('sellingPrice'))
        formData.append('sellingPrice', editedProduct.sellingPrice.toString())
      if (hasChanged('stock'))
        formData.append('stock', editedProduct.stock.toString())
      if (hasChanged('discount'))
        formData.append('discount', editedProduct.discount?.toString() || '')

      if (hasChanged('unit')) formData.append('unit', editedProduct.unit._id)
      if (hasChanged('category'))
        formData.append('category', editedProduct.category._id)

      // if (hasChanged('sections'))
      //   formData.append(
      //     'sections',
      //     JSON.stringify(editedProduct.sections || [])
      //   )
      if (hasChanged('variations'))
        formData.append(
          'variations',
          JSON.stringify(editedProduct.variations || [])
        )
      if (editedProduct.visible !== originalProduct.isPublished)
        formData.append('isPublished', editedProduct.visible.toString())

      // Process Images
      const editedImages: ProductImage[] = editedProduct.productImages || []
      const originalImages: ProductImage[] = originalProduct.productImages || []

      console.log('Original Images:', originalImages)
      console.log('Edited Images:', editedImages)

      // Helper: convert to map by publicId
      // const originalMap = new Map<string, ProductImage>(
      //   originalImages.map((img) => [img.url, img])
      // )

      const editedMap = new Map<string, ProductImage>(
        editedImages.filter((img) => img.url).map((img) => [img.url, img])
      )

      const imageUpdates: any[] = []

      // 1. Detect removed or isMain toggled images
      originalImages.forEach((origImg) => {
        const editedImg = editedMap.get(origImg.url)

        if (!editedImg) {
          // Removed image
          imageUpdates.push({ url: origImg.url, _action: 'delete' })
        } else if (origImg.isMain !== editedImg.isMain) {
          // isMain flag changed
          imageUpdates.push({
            url: origImg.url,
            isMain: editedImg.isMain,
            _action: 'update',
          })
        }
      })

      // 2. Detect added or replaced images
      editedImages.forEach((img: any, index: number) => {
        if (img.file) {
          // New or replaced image (has File)
          formData.append(`productImages[${index}]`, img.file)
          if (img.isMain) {
            formData.append(
              `productImages[${index}].isMain`,
              img.isMain.toString()
            )
          }
        }
      })

      if (imageUpdates.length > 0) {
        formData.append('imageUpdates', JSON.stringify(imageUpdates))
      }

      console.log('productId:', productId)

      const response = await axios.put(
        `${API_URL}/product/${productId}`,
        formData,
        {
          withCredentials: true,
        }
      )

      return response.data
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      const response = await axios.delete(`${API_URL}/product/${productId}`, {
        withCredentials: true,
      })

      return response.data
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const [operation, setOperation] = useState<'edit' | 'add'>('edit')
  const [editingProduct, setEditingProduct] = useState<SavedProduct | null>(
    null
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleEditProduct(values: any) {
    const toastId = toast.loading('Editing product...')
    console.log('Editing product:', values)
    try {
      await updateProduct.mutateAsync({
        productId: values._id,
        editedProduct: values,
        originalProduct: editingProduct as SavedProduct,
      })
      toast.success('Product edited successfully', { id: toastId })
      setEditingProduct(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to edit product:', error)
      toast.error(
        `Product edit failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        { id: toastId }
      )
    }
  }

  const handleEdit = async (productId: string, operation: 'edit' | 'add') => {
    setOperation(operation)
    try {
      const product = await fetchProductById(productId)
      setEditingProduct(product)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error fetching product data for editing:', error)
      toast.error('Failed to fetch product data for editing.')
    }
  }

  async function handleDelete(productId: string) {
    console.log('Deleting product with ID:', productId)
    const toastId = toast.loading('Deleting product...')
    try {
      await deleteProduct.mutateAsync({
        productId: productId,
      })
      toast.success('Product deleted successfully', { id: toastId })
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error(
        `Product deletion failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        { id: toastId }
      )
    }
  }

  return (
    <ProductsProvider>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
            <p className='text-xs text-muted-foreground'>Products Lists</p>
          </div>
          <div className='flex gap-2'>
            <ProductsPrimaryButtons />
            <Select
              value={sort}
              onValueChange={(val) =>
                setSort(val as 'ascending' | 'descending')
              }
            >
              <SelectTrigger className='w-16'>
                <SelectValue>
                  <IconAdjustmentsHorizontal size={18} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent align='end'>
                <SelectItem value='ascending'>
                  <div className='flex items-center gap-4'>
                    <IconSortAscendingLetters size={16} />
                    <span>Ascending</span>
                  </div>
                </SelectItem>
                <SelectItem value='descending'>
                  <div className='flex items-center gap-4'>
                    <IconSortDescendingLetters size={16} />
                    <span>Descending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-hidden px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={products}
            columns={columns(handleEdit, handleDelete)}
          />
          {isLoading && (
            <div className='flex size-full items-center justify-center text-xs'>
              Loading products...
            </div>
          )}
        </div>
        {editingProduct && (
          <ProductModal
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            product={editingProduct}
            mode={operation}
            onSubmit={handleEditProduct}
          />
        )}
      </Main>
    </ProductsProvider>
  )
}
