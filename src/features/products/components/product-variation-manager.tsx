import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ProductDraft } from '../add-product'
import { Variation } from '../data/schema'

type Props = {
  variation: Variation
  productIndex: number
  variationIndex: number
  setProducts: React.Dispatch<React.SetStateAction<ProductDraft[]>>
  onRemoveSubVariation: (subName: string) => void
  onQuantityChange: (
    subName: string,
    field: 'quantity' | 'amount',
    value: number
  ) => void
}

export const VariationManager = ({
  variation,
  setProducts,
  productIndex,
  variationIndex,
  onRemoveSubVariation,
  onQuantityChange,
}: Props) => {
  const isColor = variation.variantType === 'Color'

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [amount, setAmount] = useState(0)
  const [colorHex, setColorHex] = useState('#000000')

  const colorNameToHex = (name: string): string | null => {
    const colors: Record<string, string> = {
      red: '#ff0000',
      blue: '#0000ff',
      green: '#00ff00',
      yellow: '#ffff00',
      orange: '#ffa500',
      purple: '#800080',
      pink: '#ffc0cb',
      black: '#000000',
      white: '#ffffff',
      gray: '#808080',
      brown: '#a52a2a',
      cyan: '#00ffff',
      magenta: '#ff00ff',
    }

    return colors[name.toLowerCase()] || null
  }

  const handleAdd = () => {
    const inputName = name.trim()
    if (!inputName) return

    const checkName = isColor ? colorHex.toLowerCase() : inputName.toLowerCase()

    setProducts((prev) => {
      const updated = [...prev]
      const productCopy = { ...updated[productIndex] }
      const variationCopy = [...(productCopy.variations || [])]

      const currentVariation = variationCopy[variationIndex]
      if (!currentVariation) return prev

      const subVariationExists = currentVariation.subVariation.some(
        (sub) => sub.name.toLowerCase() === checkName
      )

      if (subVariationExists) {
        alert(`${currentVariation.variantType} "${inputName}" already exists.`)
        return prev
      }

      const finalColor =
        isColor && colorHex === '#000000'
          ? colorNameToHex(inputName) || '#000000'
          : colorHex

      const updatedSubVariations = [
        {
          name: isColor ? finalColor : inputName,
          quantity,
          amount,
        },
        ...currentVariation.subVariation,
      ]

      variationCopy[variationIndex] = {
        ...currentVariation,
        subVariation: updatedSubVariations,
      }

      productCopy.variations = variationCopy
      updated[productIndex] = productCopy

      return updated
    })

    setName('')
    setQuantity(0)
    setAmount(0)
    setColorHex('#000000')
  }

  const removeVariationType = (productIndex: number, variantType: string) => {
    setProducts((prev) => {
      const updated = [...prev]
      const productCopy = {
        ...updated[productIndex],
        variations: [...(updated[productIndex].variations || [])],
      }

      // Remove the variation with the matching variantType
      productCopy.variations = productCopy.variations.filter(
        (v) => v.variantType !== variantType
      )

      updated[productIndex] = productCopy
      return updated
    })
  }

  return (
    <div className='mt-6 rounded-sm border p-2'>
      <div className='flex items-center justify-between'>
        <div>
          {' '}
          <Label className='capitalize'>{variation.variantType}</Label>
          <p className='mb-2 text-xs text-muted-foreground'>
            Add available {variation.variantType.toLowerCase()}s and quantities
          </p>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() =>
            removeVariationType(productIndex, variation.variantType)
          }
          className='ml-1 h-6 w-6 p-0 text-gray-500 hover:text-red-500'
        >
          <X className='h-3 w-3' />
        </Button>
      </div>
      <Separator className='my-2' />

      {/* Input section */}
      <div className='mb-4 flex flex-wrap gap-2'>
        {isColor ? (
          <>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Color name'
              className='w-28'
            />
            <Input
              type='color'
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className='bg-[`${colorHex}`] h-10 w-14 p-1'
            />
          </>
        ) : (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${variation.variantType}`}
            className='w-40'
          />
        )}
        <Input
          type='number'
          min='0'
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder='Qty'
          className='w-20'
        />
        <Input
          type='number'
          min='0'
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder='Amount'
          className='w-24'
        />
        <Button type='button' onClick={handleAdd} variant='outline'>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Display section */}
      <div className='flex flex-wrap gap-2'>
        {variation.subVariation.map((item) => (
          <div
            key={item.name}
            className='flex w-full items-center justify-between rounded-md border bg-white p-2'
          >
            {isColor && (
              <div
                className='mr-1 h-5 w-5 rounded-full border'
                style={{ backgroundColor: item.name }}
              />
            )}
            <Badge
              variant='outline'
              className='mr-2 px-2 py-1 text-sm font-medium'
            >
              {item.name}
            </Badge>
            <div className='flex items-center gap-1'>
              <Label className='text-xs text-gray-500'>Qty:</Label>
              <Input
                type='number'
                min='0'
                value={item.quantity}
                onChange={(e) =>
                  onQuantityChange(
                    item.name,
                    'quantity',
                    Number(e.target.value)
                  )
                }
                className='h-7 w-16 text-sm'
              />
            </div>
            <div className='ml-2 flex items-center gap-1'>
              <Label className='text-xs text-gray-500'>Amount:</Label>
              <Input
                type='number'
                min='0'
                value={item.amount}
                onChange={(e) =>
                  onQuantityChange(item.name, 'amount', Number(e.target.value))
                }
                className='h-7 w-20 text-sm'
              />
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => onRemoveSubVariation(item.name)}
              className='ml-1 h-6 w-6 p-0 text-gray-500 hover:text-red-500'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        ))}
      </div>

      {variation.subVariation.length === 0 && (
        <div className='rounded-md border border-dashed p-4 text-center text-gray-500'>
          No {variation.variantType.toLowerCase()}s added yet. Add them above.
        </div>
      )}
    </div>
  )
}
