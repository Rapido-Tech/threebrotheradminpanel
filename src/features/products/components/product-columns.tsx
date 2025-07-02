import { ColumnDef } from '@tanstack/react-table'
import { formatCurrencyIntl } from '@/utils/helper-functions'
import { Checkbox } from '@/components/ui/checkbox'
import { SavedProduct } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

// Assuming this is the correct path

export const columns: ColumnDef<SavedProduct>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'productImages',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Main Image' />
    ),
    cell: ({ row }) => {
      const mainImage = row.original.productImages.find((image) => image.isMain)
      return mainImage ? (
        <div className='flex size-20 items-center justify-center'>
          {' '}
          <img
            src={mainImage.url}
            alt='Main product image'
            className='mx-auto size-full object-contain'
          />
        </div>
      ) : (
        <span>No main image</span> // If there's no main image
      )
    },
  },
  {
    accessorKey: 'productName', // Directly accessing the productName
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product Name' />
    ),
    cell: ({ row }) => (
      <div className='text-xs'>{row.original.productName}</div>
    ),
  },
  // {
  //   accessorKey: 'brand', // Directly accessing the brands
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Brand' />
  //   ),
  //   cell: ({ row }) => <div className='text-xs'>{row.original.brand}</div>,
  // },
  {
    accessorKey: 'stock', // Directly accessing the stock
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row }) => <div className='text-xs'>{row.original.stock}</div>,
  },
  {
    accessorKey: 'sellingPrice', // Directly accessing the sellingPrice
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Selling Price' />
    ),
    cell: ({ row }) => (
      <div className='text-xs'>
        {formatCurrencyIntl(row.original.sellingPrice)}
      </div>
    ), // Formatting the price
  },
  {
    accessorKey: 'category', // Directly accessing the category
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => (
      <div className='text-xs capitalize'>
        {row.original.category.categoryName}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt', // Directly accessing the createdAt
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => (
      <div className='text-xs'>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ), // Formatting the date
  },

  {
    accessorKey: 'visible',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active' />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isPublished}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
  },
]
