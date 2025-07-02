interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='container grid h-lvh flex-col items-center justify-center bg-primary-foreground'>
      <div className=''>{children}</div>
    </div>
  )
}
