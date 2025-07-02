import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useShopStore } from '@/stores/shopStore'

const API_URL = import.meta.env.VITE_API_URL

export const handleLogout = async () => {
  await axios.get(`${API_URL}/logout`)
  useAuthStore.getState().reset()
  useShopStore.getState().reset()
}
