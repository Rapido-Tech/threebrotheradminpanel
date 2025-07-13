import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Upload, X } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import DynamicAddModal from '@/components/add-items-modal'
import SelectField from '@/components/select-field'
import { VariationManager } from './components/product-variation-manager'
import { Product, ProductsFormData, ProductsFormSchema } from './data/schema'
import { useProductMetaData } from './hook/fetch-data'
import { createProduct, deleteSection } from './util/products.utils'

type ProductImage = {
  id: string
  file: File
  preview: string
  isMain?: boolean
}

type Section = {
  _id: string
  sectionName: string
}

export type ProductDraft = Partial<Omit<Product, 'productImages'>> & {
  productImages: Product['productImages']
}

export default function AddNewProduct() {
  const queryClient = useQueryClient()

  const { isLoading, categories, units, sections } = useProductMetaData()

  const [draftProduct, setDraftProduct] = useState<ProductDraft[]>([])

  const [newVariantType, setNewVariantType] = useState('')
  const [newSubVariationName, setNewSubVariationName] = useState('')
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)
  const [openAddUnitModal, setOpenAddUnitModal] = useState(false)
  const [openAddSectionModal, setOpenAddSectionModal] = useState(false)

  const addProductMutation = useMutation({
    mutationFn: (data: FormData) => {
      return createProduct(data)
    },
    onSuccess: () => {
      toast.success('Product added successfully!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDraftProduct([])
      reset({ products: [] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add product.')
    },
  })

  const removeSectionMutation = useMutation({
    mutationFn: (sectionId: string) => {
      return deleteSection(sectionId)
    },
    onSuccess: () => {
      // Invalidate and refetch the section list query
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductsFormData>({
    resolver: zodResolver(ProductsFormSchema),
    defaultValues: {
      products: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  })

  const handleAddProduct = () => {
    const newProduct = {
      productImages: [],
      variations: [],
    }

    append({
      productName: '',
      description: '',
      buyingPrice: 0,
      sellingPrice: 0,
      stock: 0,
      discount: 0,
      unit: { _id: '', unitName: '', unitSymbol: '' },
      category: { _id: '', categoryName: '' },
      sections: [],
      visible: true,
      ...newProduct,
    })
    setDraftProduct((prev) => [...prev, newProduct])
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = draftProduct.filter((_, i) => i !== index)
    setDraftProduct(updatedProducts)
    remove(index)
  }

  const onSubmit = (data: any) => {
    const formData = new FormData()

    // Merge data from the form values and state
    data.products.forEach((formProduct: Product, index: number) => {
      const productFromState = draftProduct[index] // Get the corresponding product from state

      // Merge form data and state data (e.g., images, variations)
      const mergedProduct = {
        ...formProduct,
        productImages: productFromState.productImages,
        variations: productFromState.variations,
      }

      console.log('mergedProduct:', mergedProduct)

      // Manually append the merged data to FormData
      formData.append(
        `products[${index}].productName`,
        mergedProduct.productName
      )
      formData.append(
        `products[${index}].description`,
        mergedProduct.description
      )
      formData.append(
        `products[${index}].buyingPrice`,
        mergedProduct.buyingPrice.toString()
      )
      formData.append(
        `products[${index}].sellingPrice`,
        mergedProduct.sellingPrice.toString()
      )
      formData.append(
        `products[${index}].discount`,
        mergedProduct.discount !== undefined && mergedProduct.discount !== null
          ? mergedProduct.discount.toString()
          : '0'
      )
      formData.append(
        `products[${index}].stock`,
        mergedProduct.stock.toString()
      )
      formData.append(
        `products[${index}].category`,
        mergedProduct.category._id.toString()
      )
      formData.append(
        `products[${index}].unit`,
        mergedProduct.unit._id.toString()
      )
      formData.append(
        `products[${index}].visible`,
        mergedProduct.visible.toString()
      )
      formData.append(
        `products[${index}].sections`,
        JSON.stringify(
          mergedProduct.sections
            .map((s) => s._id)
            .filter((id) => id && id.trim() !== '')
        )
      )

      // Add images for each product
      mergedProduct.productImages.forEach((img, i) => {
        formData.append(`products[${index}].productImages[${i}].id`, img.id)
        formData.append(`products[${index}].productImages[${i}]`, img.file)
        if (img.isMain) {
          formData.append(
            `products[${index}].productImages[${i}].isMain`,
            img.isMain.toString()
          )
        }
      })

      // Add variations for each product
      mergedProduct.variations?.forEach((v, i) => {
        formData.append(
          `products[${index}].variations[${i}].variantType`,
          v.variantType || ''
        )
        v.subVariation.forEach((sub, j) => {
          formData.append(
            `products[${index}].variations[${i}].subVariation[${j}]`,
            JSON.stringify(sub)
          )
        })
      })
    })

    // Call your mutation to submit the form data
    addProductMutation.mutate(formData)
  }

  const addVariationType = (
    index: number,
    variantType: string,
    subVariationName: string
  ) => {
    if (!variantType.trim() || !subVariationName.trim()) return

    setDraftProduct((prev) => {
      // Deep clone the product at index
      const updated = [...prev]
      const productCopy = {
        ...updated[index],
        variations: [...(updated[index].variations || [])],
      }

      const exists = productCopy.variations.some(
        (v) =>
          v.variantType === variantType &&
          v.subVariation.some(
            (sub) => sub.name.toLowerCase() === subVariationName.toLowerCase()
          )
      )

      if (exists) {
        alert(
          `Variation "${variantType}" with "${subVariationName}" already exists.`
        )
        return prev
      }

      // Push new variation
      productCopy.variations = [
        {
          id: crypto.randomUUID(),
          variantType,
          subVariation: [{ name: subVariationName, quantity: 0, amount: 0 }],
        },
        ...productCopy.variations,
      ]
      // Replace product in the array
      updated[index] = productCopy

      return updated
    })
  }

  const handleSetMainImage = (imageId: string, index: number) => {
    setDraftProduct((prev) => {
      const updated = [...prev]
      const productCopy = {
        ...updated[index],
        productImages: updated[index].productImages.map((img) => ({
          ...img,
          isMain: img.id === imageId,
        })),
      }

      updated[index] = productCopy
      return updated
    })
  }

  const handleRemoveImage = (imageId: string, index: number) => {
    setDraftProduct((prev) => {
      const updated = [...prev]
      const product = updated[index]

      const filteredImages = product.productImages.filter(
        (img) => img.id !== imageId
      )

      // If the removed image was main, set the first image (if any) as main
      const updatedImages = filteredImages.map((img, idx) => ({
        ...img,
        isMain: idx === 0,
      }))

      updated[index] = {
        ...product,
        productImages: updatedImages,
      }

      return updated
    })
  }

  if (isLoading) {
    return <p className='text-xs text-muted-foreground'>Loading</p>
  }
  // if (error) {
  //   return <p className='text-xs text-muted-foreground'>Error</p>
  // }

  return (
    <div className='my-2'>
      {fields.map((product, index) => (
        <form key={index} className='px-2'>
          <div className='lg:grid lg:grid-cols-2 lg:gap-2'>
            {/* Product Form Fields */}
            <div className='space-y-4 rounded-lg bg-muted p-3 md:p-6'>
              <div>
                <Controller
                  control={control}
                  name={`products.${index}.productName` as const}
                  render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                      <Label>Product Name</Label>
                      <Input
                        {...field}
                        type='text'
                        placeholder='Product Name'
                      />
                      {errors.products?.[index]?.productName && (
                        <p className='mt-1 text-sm text-red-500'>
                          {errors.products[index]?.productName?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div>
                  <Controller
                    name={`products.${index}.category` as const}
                    control={control}
                    render={({ field }) => (
                      <>
                        <SelectField
                          label='Category'
                          id='category'
                          placeholder='Select Product Category'
                          value={field.value}
                          onChange={(selectedCategory) => {
                            field.onChange(selectedCategory)
                          }}
                          options={categories}
                          addModalOpen={openAddCategoryModal}
                          setAddModalOpen={setOpenAddCategoryModal}
                          itemType='category'
                        />
                        {errors.products?.[index]?.category && (
                          <p className='mt-1 text-sm text-red-500'>
                            {errors.products[index]?.category?.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`products.${index}.unit` as const}
                    control={control}
                    render={({ field }) => (
                      <>
                        <SelectField
                          label='Unit'
                          id='unit'
                          placeholder='Select Product unit'
                          value={field.value}
                          onChange={(selectedUnit) => {
                            field.onChange(selectedUnit)
                          }}
                          options={units}
                          addModalOpen={openAddUnitModal}
                          setAddModalOpen={setOpenAddUnitModal}
                          itemType='unit'
                        />
                        {errors.products?.[index]?.unit && (
                          <p className='mt-1 text-sm text-red-500'>
                            {errors.products[index]?.unit?.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              <div>
                <Controller
                  control={control}
                  name={`products.${index}.description` as const}
                  defaultValue={product.description}
                  render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                      <Label>Description</Label>
                      <Textarea {...field} placeholder='Product Description' />
                      {errors.products?.[index]?.description && (
                        <p className='mt-1 text-sm text-red-500'>
                          {errors.products[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name={`products.${index}.stock` as const}
                  defaultValue={product.stock}
                  render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                      <Label>Stock</Label>
                      <Input
                        {...field}
                        type='number'
                        placeholder='Stock Quantity'
                      />
                      {errors.products?.[index]?.stock && (
                        <p className='mt-1 text-sm text-red-500'>
                          {errors.products[index]?.stock?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <Controller
                  control={control}
                  name={`products.${index}.buyingPrice` as const}
                  defaultValue={product.buyingPrice}
                  render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                      <Label>Buying Price</Label>
                      <Input
                        {...field}
                        type='number'
                        placeholder='Buying Price'
                      />
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`products.${index}.sellingPrice` as const}
                  defaultValue={product.sellingPrice}
                  render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                      <Label>Selling Price</Label>
                      <Input
                        {...field}
                        type='number'
                        placeholder='Selling Price'
                      />
                      {errors.products?.[index]?.sellingPrice && (
                        <p className='mt-1 text-sm text-red-500'>
                          {errors.products[index]?.sellingPrice?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`products.${index}.discount` as const}
                  defaultValue={product.discount}
                  render={({ field }) => (
                    <div className='flex flex-col space-y-2'>
                      <Label>Discount</Label>
                      <Input
                        {...field}
                        type='number'
                        placeholder='Discount (%)'
                      />
                    </div>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <div>
                  <Label>Product Variation</Label>

                  <p className='mb-2 text-xs text-muted-foreground'>
                    Set Product Variety Stock and Prices
                  </p>
                  <div className='flex gap-2 !text-xs'>
                    <Input
                      value={newVariantType}
                      onChange={(e) => setNewVariantType(e.target.value)}
                      placeholder='Size, Color...'
                      className='!text-xs'
                    />
                    <Input
                      value={newSubVariationName} // For subVariation name input
                      onChange={(e) => setNewSubVariationName(e.target.value)}
                      placeholder=' Small, Red...'
                      className='!text-xs'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        if (
                          newVariantType.trim() &&
                          newSubVariationName.trim()
                        ) {
                          addVariationType(
                            index,
                            newVariantType.trim(),
                            newSubVariationName.trim()
                          )
                          setNewVariantType('')
                          setNewSubVariationName('')
                        }
                      }}
                    >
                      Add Variation
                    </Button>
                  </div>
                </div>
                {draftProduct[`${index}`]?.variations?.map(
                  (variation, variationIndex) => (
                    <VariationManager
                      key={variation.id}
                      productIndex={index}
                      variationIndex={variationIndex}
                      variation={variation}
                      onRemoveSubVariation={(subName: string) => {
                        setDraftProduct((prev) => {
                          const updated = [...prev]
                          if (!updated[index].variations) {
                            updated[index].variations = []
                          }
                          updated[index].variations[
                            variationIndex
                          ].subVariation = updated[index].variations[
                            variationIndex
                          ].subVariation.filter((sub) => sub.name !== subName)
                          return updated
                        })
                      }}
                      onQuantityChange={(subName, field, value) => {
                        setDraftProduct((prev) => {
                          const updated = [...prev]
                          if (!updated[index].variations) {
                            updated[index].variations = []
                          }
                          const sub = updated[index].variations[
                            variationIndex
                          ].subVariation.find((s) => s.name === subName)

                          if (sub) {
                            sub[field] = value
                          }

                          return updated
                        })
                      }}
                      setProducts={setDraftProduct}
                    />
                  )
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className='space-y-4 rounded-lg bg-muted p-6'>
              <div className='mb-4'>
                <Label>Product Images</Label>

                <p className='mb-2 text-xs text-muted-foreground'>
                  {draftProduct[`${index}`]?.productImages.length
                    ? 'Click an image to set as main. First is main by default.'
                    : 'No images uploaded yet.'}
                </p>
              </div>
              <Dropzone
                accept={{ 'image/*': [] }}
                multiple
                onDrop={(acceptedFiles) => {
                  const newImages: ProductImage[] = acceptedFiles.map(
                    (file) => ({
                      id: crypto.randomUUID(),
                      file,
                      preview: URL.createObjectURL(file),
                      isMain: false,
                    })
                  )

                  setDraftProduct((prev) => {
                    const updated = [...prev]
                    const product = updated[index]

                    // Determine if we need to set a main image
                    const hasMain = product.productImages?.some(
                      (img) => img.isMain
                    )

                    const mergedImages = [
                      ...product.productImages,
                      ...newImages,
                    ].map((img, i) => ({
                      ...img,
                      isMain: hasMain ? img.isMain : i === 0, // if no main exists, first one becomes main
                    }))

                    updated[index] = {
                      ...product,
                      productImages: mergedImages,
                    }

                    return updated
                  })
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className='cursor-pointer'>
                    <label className='flex size-16 flex-col items-center justify-center rounded-md border bg-gray-100 hover:bg-gray-200'>
                      <Upload className='mb-1 size-6 text-gray-400' />
                      <span className='text-xs text-muted-foreground'>Add</span>
                    </label>
                    <input {...getInputProps()} />
                  </div>
                )}
              </Dropzone>

              <div className='mt-4 flex flex-wrap gap-2'>
                {draftProduct[`${index}`]?.productImages.map((img) => (
                  <div
                    key={img.id}
                    className={`relative cursor-pointer overflow-hidden rounded-md border ${
                      img.isMain ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => handleSetMainImage(img.id, index)}
                  >
                    <img src={img.preview} className='h-20 w-20 object-cover' />
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
                        handleRemoveImage(img.id, index)
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Separator />
                <div className='w-svw'>
                  <DynamicAddModal
                    itemType='section'
                    open={openAddSectionModal}
                    onOpenChange={setOpenAddSectionModal}
                  />
                  <Controller
                    name={`products.${index}.sections`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <Label>Product Section</Label>
                            <p className='mb-2 text-xs text-muted-foreground'>
                              Select sections where this product should appear
                            </p>
                          </div>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => setOpenAddSectionModal(true)}
                          >
                            <Plus className='h-4 w-4' />
                          </Button>{' '}
                        </div>
                        {sections.map((section: Section) => (
                          <div
                            key={section._id}
                            className='flex items-center space-x-2'
                          >
                            <Card className='w-full rounded-sm px-2 py-1'>
                              <CardContent className='m-0 p-0'>
                                <div className='grid grid-cols-7 items-center gap-x-2'>
                                  <div className='col-span-1 flex size-full items-center'>
                                    <Checkbox
                                      id={`section-${section._id}`}
                                      checked={(field.value ?? []).some(
                                        (s: Section) => s._id === section._id
                                      )}
                                      onCheckedChange={(checked) => {
                                        const currentSections =
                                          field.value ?? []

                                        if (checked) {
                                          const alreadyExists =
                                            currentSections.some(
                                              (s: Section) =>
                                                s._id === section._id
                                            )
                                          if (!alreadyExists) {
                                            field.onChange([
                                              ...currentSections,
                                              section,
                                            ])
                                          }
                                        } else {
                                          field.onChange(
                                            currentSections.filter(
                                              (s: Section) =>
                                                s._id !== section._id
                                            )
                                          )
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className='col-span-3 flex size-full items-center'>
                                    <div>
                                      <Label
                                        htmlFor={`section-${section._id}`}
                                        className='text-sm capitalize'
                                      >
                                        {section.sectionName}
                                      </Label>
                                    </div>
                                  </div>
                                  <div className='col-span-2 flex size-full items-center'>
                                    <div>
                                      <Button size='sm' variant='outline'>
                                        {' '}
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                  <div className='col-span-1 flex size-full items-center'>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      className='ml-1 h-6 w-6 p-0 text-gray-500 hover:text-red-500'
                                      onClick={() =>
                                        removeSectionMutation.mutate(
                                          section._id
                                        )
                                      }
                                    >
                                      <X className='h-3 w-3' />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}

                        {errors.products?.[index]?.sections && (
                          <p className='mt-1 text-sm text-red-500'>
                            {errors.products[index]?.sections?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Separator />

                {/* Visibility */}
                <Controller
                  name={`products.${index}.visible`}
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-1'>
                      <Label>Product online</Label>
                      <p className='mb-2 text-xs text-muted-foreground'>
                        Should this product be visible to customers?
                      </p>
                      <div className='flex items-center space-x-4'>
                        <Checkbox
                          id='product-visibility'
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor='product-visibility' className='text-sm'>
                          Visible
                        </Label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className='col-span-2 mb-2 flex justify-between border-b pb-2'>
            {draftProduct.length > 1 && (
              <Button
                type='button'
                variant='destructive'
                onClick={() => handleRemoveProduct(index)}
              >
                Remove Product
              </Button>
            )}
          </div>
        </form>
      ))}

      <div className='flex justify-between p-4'>
        <Button onClick={handleAddProduct}>Add New Product</Button>
        <Button type='submit' onClick={handleSubmit(onSubmit)}>
          {addProductMutation.isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  )
}
