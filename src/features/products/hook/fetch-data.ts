import axios from 'axios'
import { useQueries } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL

export function useProductMetaData() {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/category`, {
        withCredentials: true,
      })
      //console.log('Categories', res.data)
      return res.data.categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${API_URL}/unit`, {
        withCredentials: true,
      })
      //console.log('Units', res.data)
      return res.data.units
    } catch (error) {
      console.error('Error fetching units:', error)
      return []
    }
  }

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${API_URL}/section`, {
        withCredentials: true,
      })
      //console.log('Sections', res.data)
      return res.data.sections
    } catch (error) {
      console.error('Error fetching sections:', error)
      return []
    }
  }

  const results = useQueries({
    queries: [
      {
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['units'],
        queryFn: fetchUnits,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['sections'],
        queryFn: fetchSections,
        staleTime: 1000 * 60 * 5,
      },
    ],
  })

  const isLoading = results.some((r) => r.isLoading)
  const error = results.find((r) => r.error)?.error
  const [categories = [], units = [], sections = []] = results.map(
    (r) => r.data || []
  )

  return { isLoading, error, categories, units, sections }
}
// export const categories = [
//   { id: '1', name: 'Electronics' },
//   { id: '2', name: 'Clothing' },
//   { id: '3', name: 'Home & Garden' },
//   { id: '4', name: 'Beauty & Personal Care' },
//   { id: '5', name: 'Sports & Outdoors' },
//   { id: '6', name: 'Books & Media' },
//   { id: '7', name: 'Toys & Games' },
//   { id: '8', name: 'Automotive' },
//   { id: '9', name: 'Health & Wellness' },
//   { id: '10', name: 'Food & Beverages' },
//   { id: '11', name: 'Jewelry & Accessories' },
//   { id: '12', name: 'Office Supplies' },
//   { id: '13', name: 'Pet Supplies' },
//   { id: '14', name: 'Shoes' },
//   { id: '15', name: 'Music' },
//   { id: ' 16', name: 'Art & Crafts' },
//   { id: '17', name: 'Collectibles' },
//   { id: '18', name: 'Gifts & Stationery' },
//   { id: '19', name: 'Tools & Hardware' },
//   { id: '20', name: 'Cameras & Photography' },
//   { id: '21', name: 'Video Games' },
//   { id: '22', name: 'Musical Instruments' },
//   { id: '23', name: 'Office Furniture' },
//   { id: '24', name: 'Home Appliances' },
//   { id: '25', name: 'Garden & Outdoor' },
//   { id: '26', name: 'Baby & Kids' },
//   { id: '27', name: 'Luggage & Travel' },
//   { id: '28', name: 'Watches' },
//   { id: '29', name: 'Stationery' },
//   { id: '30', name: 'Craft Supplies' },
//   { id: '31', name: 'Hobbies' },]
