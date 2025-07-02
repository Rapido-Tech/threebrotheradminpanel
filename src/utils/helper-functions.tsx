import { PhoneNumberUtil } from 'google-libphonenumber'

// -----------------------
// 🔸 Phone Validation Input
// -----------------------

const phoneUtil = PhoneNumberUtil.getInstance()

export const isPhoneValid = (phone: string) => {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phone)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (error) {
    return false
  }
}

// -----------------------
// 🔸 Words Capitalization function
// -----------------------

export const capitalizeWords = (str: string): string => {
  return str
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// -----------------------
// 🔸  Function to get Currency
// -----------------------

export const formatCurrencyIntl = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount)
}

// -----------------------
// 🔸  Function to get current date
// -----------------------

export const formatCurrentDate = (): string => {
  const currentDate = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(currentDate)
}

// -----------------------
// 🔸  Function to get first monday
// -----------------------
export const getMondayOfThisWeek = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + difference)

  return monday
}

// -----------------------
// 🔸  Function to Formart numeric values
// -----------------------
export function formatNumber(value: number | string): string {
  if (value === null || value === undefined || value === '') return ''

  // Convert to number if it's a string
  const num = typeof value === 'string' ? Number.parseFloat(value) : value

  // Check if it's a valid number
  if (isNaN(num)) return ''

  // Format with thousand separators
  return num.toLocaleString('en-US')
}

/**
 * Parse a formatted number string back to a number
 */
export function parseFormattedNumber(value: string): number {
  if (!value) return 0

  // Remove all non-numeric characters except decimal point
  const parsed = Number.parseFloat(value.replace(/[^\d.-]/g, ''))

  return isNaN(parsed) ? 0 : parsed
}
