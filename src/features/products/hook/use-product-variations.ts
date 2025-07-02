import { useState, useRef } from 'react'
import { Variation } from '@/features/products/data/schema'

type VariationItem = {
  name: string
  quantity: number
  amount: number
}

export function useProductVariations(initial: Variation[] = []) {
  const [variation, setVariation] = useState<Variation[]>(initial)
  const sizeInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  const ensureDefaultVariations = () => {
    const types = variation.map((v) => v.variantType)
    const newVariations = [...variation]

    if (!types.includes('Size')) {
      newVariations.push({
        id: 'size-default',
        variantType: 'Size',
        subVariation: [],
      })
    }

    if (!types.includes('Color')) {
      newVariations.push({
        id: 'color-default',
        variantType: 'Color',
        subVariation: [],
      })
    }

    setVariation(newVariations)
  }

  const addSubVariation = (variantType: string, newSub: VariationItem) => {
    setVariation((prev) =>
      prev.map((v) =>
        v.variantType === variantType
          ? {
              ...v,
              subVariation: [...v.subVariation, newSub],
            }
          : v
      )
    )
  }

  const removeSubVariation = (variantType: string, subName: string) => {
    setVariation((prev) =>
      prev.map((v) =>
        v.variantType === variantType
          ? {
              ...v,
              subVariation: v.subVariation.filter(
                (sub) => sub.name !== subName
              ),
            }
          : v
      )
    )
  }

  const updateSubVariationQty = (
    variantType: string,
    name: string,
    quantity: number,
    amount: number
  ) => {
    setVariation((prev) =>
      prev.map((v) =>
        v.variantType === variantType
          ? {
              ...v,
              subVariation: v.subVariation.map((sub) =>
                sub.name === name ? { ...sub, quantity, amount } : sub
              ),
            }
          : v
      )
    )
  }

  const removeVariationType = (variantType: string) => {
    setVariation((prev) => prev.filter((v) => v.variantType !== variantType))
  }

  return {
    variation,
    setVariation,
    sizeInputRef,
    colorInputRef,
    addSubVariation,
    removeSubVariation,
    updateSubVariationQty,
    removeVariationType,
    ensureDefaultVariations,
  }
}
