// import { showSubmittedData } from '@/utils/show-submitted-data'
// import { ConfirmDialog } from '@/components/confirm-dialog'
// import { useProducts } from './context/products-context'

// export function TasksDialogs() {
//   const { open, setOpen, currentRow, setCurrentRow } = useProducts()
//   return (
//     <>
//       {/* <TasksMutateDrawer
//         key='task-create'
//         open={open === 'create'}
//         onOpenChange={() => setOpen('create')}
//       />

//       <TasksImportDialog
//         key='tasks-import'
//         open={open === 'import'}
//         onOpenChange={() => setOpen('import')}
//       /> */}

//       {currentRow && (
//         <>
//           {/* <TasksMutateDrawer
//             key={`task-update-${currentRow._id}`}
//             open={open === 'update'}
//             onOpenChange={() => {
//               setOpen('update')
//               setTimeout(() => {
//                 setCurrentRow(null)
//               }, 500)
//             }}
//             currentRow={currentRow}
//           /> */}

//           <ConfirmDialog
//             key='task-delete'
//             destructive
//             open={open === 'delete'}
//             onOpenChange={() => {
//               setOpen('delete')
//               setTimeout(() => {
//                 setCurrentRow(null)
//               }, 500)
//             }}
//             handleConfirm={() => {
//               setOpen(null)
//               setTimeout(() => {
//                 setCurrentRow(null)
//               }, 500)
//               showSubmittedData(
//                 currentRow,
//                 'The following task has been deleted:'
//               )
//             }}
//             className='max-w-md'
//             title={`Delete this task: ${currentRow._id} ?`}
//             desc={
//               <>
//                 You are about to delete a task with the ID{' '}
//                 <strong>{currentRow._id}</strong>. <br />
//                 This action cannot be undone.
//               </>
//             }
//             confirmText='Delete'
//           />
//         </>
//       )}
//     </>
//   )
// }
