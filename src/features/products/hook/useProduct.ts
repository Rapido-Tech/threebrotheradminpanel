// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import {
//   addProductApi,
//   updateProductApi,
//   deleteProductApi,
//   getAllProductsApi,
// } from '@/features/products/api/products'

// // ADD PRODUCT HOOK
// export const useAddProduct = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: addProductApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['products'] })
//     },
//   })
// }

// // UPDATE PRODUCT HOOK
// export const useUpdateProduct = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: updateProductApi,
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['products'] })
//       queryClient.setQueryData(['products', variables.productId], data)
//     },
//   })
// }

// // DELETE PRODUCT HOOK
// export const useDeleteProduct = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: deleteProductApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['products'] })
//     },
//   })
// }

// // GET PRODUCTS WITH PAGINATION HOOK
// export const useGetAllProducts = (
//   page: number,
//   limit: number,
//   search: string = ''
// ) => {
//   return useQuery({
//     queryKey: ['products', page, limit, search],
//     queryFn: () => getAllProductsApi(page, limit, search),
//     placeholderData: () => [],
//     //keepPreviousData: true,
//   })
// }
