import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import SelectField from '@/components/select-field'
import { Product, ProductSchema, SavedProduct } from '../data/schema'
import { useProductMetaData } from '../hook/fetch-data'

interface ProductFormDialogProps {
  open: boolean
  product?: SavedProduct | null
  onSubmit: (values: any) => void
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit'
}

type FormImage = {
  id: string
  file?: File
  preview: string
  publicId?: string
  url?: string
  isMain: boolean
}

export function ProductModal({
  open,
  onOpenChange,
  mode,
  product,
  onSubmit,
}: ProductFormDialogProps) {
  const { categories, units } = useProductMetaData()
  const [openAddUnitModal, setOpenAddUnitModal] = useState(false)
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)
  const [images, setImages] = useState<FormImage[]>([])

  const form = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      productName: '',
      buyingPrice: 0,
      sellingPrice: 0,
      discount: 0,
      stock: 0,
      description: '',
      unit: { _id: '', unitName: '', unitSymbol: '' },
      category: { _id: '', categoryName: '' },
      isPublished: true,
      variations: [],
      productImages: [],
    },
  })

  const {
    control,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (product) {
      const prefills = {
        productName: product.productName,
        description: product.description,
        buyingPrice: product.buyingPrice,
        sellingPrice: product.sellingPrice,
        stock: product.stock,
        category: product.category,
        unit: product.unit,
        discount: product.discount ?? undefined,
        visible: product.isPublished,
        variations: product.variations ?? [],
        productImages: [] as any,
      }

      reset(prefills)

      const fetchedImgs = product.productImages.map((img) => ({
        id: img.url,
        publicId: img.publicId,
        url: img.url,
        preview: img.url,
        isMain: img.isMain,
      }))
      setImages(fetchedImgs)
    } else {
      reset(undefined)
      setImages([])
    }
  }, [mode, product, reset])

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newImgs = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isMain: images.length === 0,
      }))
      setImages((prev) => {
        // Determine if we need to set a main image
        const hasMain = images.some((img) => img.isMain)

        const mergedImages = [...prev, ...newImgs].map((img, i) => ({
          ...img,
          isMain: hasMain ? img.isMain : i === 0, // if no main exists, first one becomes main
        }))

        return mergedImages
      })
    },
    [images]
  )

  const handleSetMain = (id: string) => {
    setImages((imgs) => imgs.map((img) => ({ ...img, isMain: img.id === id })))
  }

  const handleRemove = (id: string) => {
    setImages((imgs) => {
      const filtered = imgs.filter((i) => i.id !== id)
      if (!filtered.some((i) => i.isMain) && filtered.length)
        filtered[0].isMain = true
      return filtered
    })
  }

  const submit = (vals: Product) => {
    const payload = {
      ...vals,
      _id: product?._id,
      stock:
        mode === 'add' ? product && product?.stock + vals.stock : vals.stock,
      productImages: images.map((img) => ({
        ...(img.file
          ? { file: img.file }
          : { publicId: img.publicId, url: img.url }),
        isMain: img.isMain,
      })),
    }
    onSubmit(payload)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset()
        onOpenChange(false)
      }}
    >
      <DialogContent className='max-w-4xl sm:max-w-[900px]'>
        <DialogHeader>
          <DialogTitle>
            {product && mode === 'add'
              ? `Restock  ${product.productName}`
              : 'Edit Product'}
          </DialogTitle>
          <DialogDescription>
            Please enter the details to{' '}
            {mode === 'add' ? 'restock' : 'update the'} product.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(100vh-120px)]'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className='space-y-4 px-4'
            >
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                {/* Product Name */}

                <div className='space-y-2'>
                  <Label htmlFor='productName'>Product Name *</Label>
                  <Controller
                    name='productName'
                    control={control}
                    render={({ field }) => (
                      <Input
                        disabled={mode === 'add'}
                        id='productName'
                        placeholder='Product Name'
                        {...field}
                      />
                    )}
                  />
                  {errors.productName && (
                    <p className='text-sm text-red-500'>
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                {/* Buying Price */}
                <div className='space-y-2'>
                  <Label htmlFor='buyingPrice'>Buying Price *</Label>
                  <Controller
                    name='buyingPrice'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='buyingPrice'
                        type='number'
                        placeholder='0'
                        {...field}
                      />
                    )}
                  />
                  {errors.buyingPrice && (
                    <p className='text-sm text-red-500'>
                      {errors.buyingPrice.message}
                    </p>
                  )}
                </div>

                {/* Selling Price */}
                <div className='space-y-2'>
                  <Label htmlFor='sellingPrice'>Selling Price *</Label>
                  <Controller
                    name='sellingPrice'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='sellingPrice'
                        type='number'
                        placeholder='0'
                        {...field}
                      />
                    )}
                  />
                  {errors.sellingPrice && (
                    <p className='text-sm text-red-500'>
                      {errors.sellingPrice.message}
                    </p>
                  )}
                </div>

                {mode === 'edit' && (
                  <>
                    {/* Category */}
                    <div>
                      <Controller
                        name='category'
                        control={control}
                        render={({ field }) => (
                          <SelectField
                            label='Category'
                            id='category'
                            placeholder='Select Product Category'
                            value={field.value}
                            onChange={field.onChange}
                            options={categories}
                            addModalOpen={openAddCategoryModal}
                            setAddModalOpen={setOpenAddCategoryModal}
                            itemType='category'
                          />
                        )}
                      />
                      {errors.category && (
                        <p className='text-sm text-red-500'>
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* Unit */}
                    <div>
                      <Controller
                        name='unit'
                        control={control}
                        render={({ field }) => (
                          <SelectField
                            label='Unit'
                            id='unit'
                            placeholder='Select Product Unit'
                            value={field.value}
                            onChange={field.onChange}
                            options={units}
                            addModalOpen={openAddUnitModal}
                            setAddModalOpen={setOpenAddUnitModal}
                            itemType='unit'
                          />
                        )}
                      />
                      {errors.unit && (
                        <p className='text-sm text-red-500'>
                          {errors.unit.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Stock */}
                <div className='space-y-2'>
                  <Label htmlFor='stock'>Stock *</Label>

                  <Controller
                    name='stock'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='stock'
                        type='number'
                        placeholder='0'
                        {...field}
                      />
                    )}
                  />
                  {errors.stock && (
                    <p className='text-sm text-red-500'>
                      {errors.stock.message}
                    </p>
                  )}
                  {mode === 'add' && product && (
                    <div className='text-xs'>
                      <div>
                        Current stock : {product?.stock}
                        {product.unit.unitSymbol}
                      </div>
                    </div>
                  )}
                </div>

                {/* Discount */}
                <div className='space-y-2'>
                  <Label htmlFor='discount'>Discount</Label>
                  <Controller
                    name='discount'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='discount'
                        type='number'
                        placeholder='0'
                        {...field}
                      />
                    )}
                  />
                  {errors.discount && (
                    <p className='text-sm text-red-500'>
                      {errors.discount.message}
                    </p>
                  )}
                </div>
              </div>
              {mode === 'edit' && (
                <div className='rounded bg-muted p-4'>
                  <Label>Product Images</Label>
                  <Dropzone accept={{ 'image/*': [] }} multiple onDrop={onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className='cursor-pointer'>
                        <label className='flex size-16 flex-col items-center justify-center rounded-md border bg-gray-100 hover:bg-gray-200'>
                          <Upload className='mb-1 size-6 text-gray-400' />
                          <span className='text-xs text-muted-foreground'>
                            Add
                          </span>
                        </label>
                        <input {...getInputProps()} />
                      </div>
                    )}
                  </Dropzone>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className={`relative cursor-pointer overflow-hidden rounded-md border ${
                          img.isMain ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        <img
                          src={img.preview}
                          className='h-24 w-24 object-cover'
                          onClick={() => handleSetMain(img.id)}
                        />
                        {img.isMain && (
                          <div className='absolute left-0 top-0 bg-green-500 px-1 text-xs text-white'>
                            Main
                          </div>
                        )}
                        <Button
                          type='button'
                          size='icon'
                          variant='destructive'
                          className='absolute right-0 top-0 h-5 w-5'
                          onClick={() => {
                            handleRemove(img.id)
                          }}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    form.reset()
                    onOpenChange(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {mode === 'add' ? 'Restock Product' : 'Update Product'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
