import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreHorizontal, PackagePlus, Trash2 } from 'lucide-react'
import { formatCurrencyIntl } from '@/utils/helper-functions'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SavedProduct } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns = (
  handleEdit: (productId: string) => void
): ColumnDef<SavedProduct>[] => {
  return [
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
        const mainImage = row.original.productImages.find(
          (image) => image.isMain
        )
        return mainImage ? (
          <div className='flex size-20 items-center justify-center overflow-hidden rounded-full'>
            <img
              src={mainImage.url}
              alt='Main product image'
              className='mx-auto aspect-square size-full object-cover object-center'
            />
          </div>
        ) : (
          <span>No main image</span>
        )
      },
    },
    {
      accessorKey: 'productName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Product Name' />
      ),
      cell: ({ row }) => (
        <div className='text-xs'>{row.original.productName}</div>
      ),
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Stock' />
      ),
      cell: ({ row }) => <div className='text-xs'>{row.original.stock}</div>,
    },
    {
      accessorKey: 'sellingPrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Selling Price' />
      ),
      cell: ({ row }) => (
        <div className='text-xs'>
          {formatCurrencyIntl(row.original.sellingPrice)}
        </div>
      ),
    },
    {
      accessorKey: 'category',
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
      id: 'totalStockValue',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Total Stock Value' />
      ),
      cell: ({ row }) => (
        <div className='text-xs'>
          {formatCurrencyIntl(row.original.stock * row.original.sellingPrice)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Actions' />
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PackagePlus className='mr-2 h-4 w-4' />
              Restock
            </DropdownMenuItem>
            <DropdownMenuItem className='text-destructive'>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
