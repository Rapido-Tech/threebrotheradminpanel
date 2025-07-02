import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <div className='relative h-svh flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-3 lg:px-0'>
      <div className='relative col-span-1 hidden h-full flex-col bg-muted p-10 lg:flex'>
        <img
          src='/images/logo.png'
          className='relative m-auto'
          width={301}
          height={60}
          alt='Vite'
        />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-xs'>
              Online purchase made simple, secure, and seamless.
            </p>
          </blockquote>
        </div>
      </div>

      <div className='col-span-2 flex h-full items-center justify-center bg-primary-foreground'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[450px]'>
          <div className='flex flex-col'>
            <h1 className='border-b pb-2 text-2xl font-semibold tracking-tight'>
              Sign In
            </h1>

            <div className='mt-4'>
              <UserAuthForm />
            </div>
          </div>

          <p className='text-pretty px-8 pt-4 text-center text-xs text-muted-foreground'>
            Already have an account?
            <Button variant='link' className='ml-1 p-0 text-xs' asChild>
              <Link to='/sign-up'>Sign Up</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
