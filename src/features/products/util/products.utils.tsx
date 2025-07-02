import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const createProduct = async (data: FormData): Promise<any> => {
  const res = await axios.post(`${API_URL}/product`, data, {
    withCredentials: true,
  })
  return res.data
}

export const deleteSection = async (sectionId: string): Promise<any> => {
  const res = await axios.delete(`${API_URL}/section/${sectionId}`, {
    withCredentials: true,
  })
  return res.data
}
