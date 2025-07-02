import { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
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
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import ProductsProvider from './context/products-context'

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

export default function Products() {
  const [sort, setSort] = useState<'ascending' | 'descending'>('ascending')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [type] = useState<'shop' | 'warehouse' | undefined>(undefined) // Optional filter

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', , page, limit, type],
    queryFn: () => {
      return getProductsPagination(page, limit)
    },
    refetchOnWindowFocus: false,
  })

  console.log('here:', setPage)

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
          <DataTable data={products} columns={columns} />
          {isLoading && (
            <div className='flex size-full items-center justify-center text-xs'>
              Loading products...
            </div>
          )}
        </div>
      </Main>
    </ProductsProvider>
  )
}
