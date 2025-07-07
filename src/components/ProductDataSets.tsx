import { useState, useMemo, useCallback } from 'react'
import {
  DatabaseBackup,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DynamicAddModal from './add-items-modal'
import DynamicEditModal from './edit-item-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface DataProps {
  onDelete: (dataItemId: string) => void
  openAddUnitModal: boolean
  setOpenAddUnitModal: (open: boolean) => void
  data: any[]
  setType: string
}

const ProductDataSets = ({
  openAddUnitModal,
  setOpenAddUnitModal,
  data,
  setType,
  onDelete,
}: DataProps) => {
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  console.log(setSearchTerm)

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const name =
        item?.unitName || item?.categoryName || item?.sectionName || ''
      return name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [data, searchTerm])

  const onEditing = useCallback((item: any) => {
    setEditingItem(item)
    setEditModalOpen(true)
  }, [])

  const getInitialDataFromItem = (item: any): Record<string, string> => {
    switch (setType) {
      case 'unit':
        return {
          unitName: item.unitName,
          unitSymbol: item.unitSymbol,
        }
      case 'category':
        return {
          categoryName: item.categoryName,
          slug: item.slug,
        }
      case 'section':
        return {
          sectionName: item.sectionName,
          slug: item.slug,
        }
      case 'shop':
        return {
          shopName: item.shopName,
          phoneNumber: item.phoneNumber,
          address: item.address,
          country: item.country,
        }
      default:
        return {}
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className='px-4 pt-2'>
        <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between'>
          {setType}
          <div className='relative flex w-full max-w-sm items-center space-x-2'>
            {/* Optional search field */}
            {/* <SearchInput onSearchChange={setSearchTerm} /> */}
            <Button
              type='button'
              size='sm'
              onClick={() => setOpenAddUnitModal(true)}
            >
              <PlusIcon className='h-4 w-4' /> Add {setType}
            </Button>
          </div>
        </div>
        <Separator className='my-3' />
      </div>

      {/* Add Modal */}
      <DynamicAddModal
        itemType={setType}
        open={openAddUnitModal}
        onOpenChange={setOpenAddUnitModal}
      />

      {/* Edit Modal */}
      {editingItem && (
        <DynamicEditModal
          itemType={setType}
          itemId={editingItem._id}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialData={getInitialDataFromItem(editingItem)}
        />
      )}

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className='container mx-auto px-4 py-10'>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>#</TableHead>
                  <TableHead>{`${setType} Name`}</TableHead>
                  <TableHead>
                    {setType === 'unit' ? 'Symbol' : 'Slug'}
                  </TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, i) => (
                  <TableRow key={item._id}>
                    <TableCell className='font-medium'>{i + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {item.unitName || item.categoryName || item.sectionName}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {setType === 'unit' ? item.unitSymbol : item.slug}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <div
                              className='flex w-full cursor-pointer gap-2'
                              onClick={() => onEditing(item)}
                            >
                              <Pencil className='mr-2 h-4 w-4' /> Edit
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <div
                              className='flex w-full cursor-pointer gap-2'
                              onClick={() => onDelete(item._id)}
                            >
                              <Trash2 className='mr-2 h-4 w-4' /> Delete
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className='flex h-[calc(100vh-200px)] flex-col items-center justify-center'>
          <DatabaseBackup className='mb-4 h-16 w-16 text-gray-400' />
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>
            No {setType} found
          </h2>
          <p className='mb-4 max-w-md text-center text-gray-500'>
            You can add, delete, or update {setType} items anytime.
          </p>
          <Button type='button' onClick={() => setOpenAddUnitModal(true)}>
            Add Your First {setType}
          </Button>
        </div>
      )}
    </>
  )
}

export default ProductDataSets
