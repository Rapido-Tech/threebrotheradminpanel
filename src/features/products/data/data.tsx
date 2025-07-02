import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const fetchProducts = async () => {
  const response = await axios.get('/api/products', {
    withCredentials: true,
  })
  return response.data.data
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })
}
