'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { Home } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useSelector((state: RootState) => state.auth.user)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 relative p-4'>
      <div className='absolute top-4 left-4'>
        <Link href='/'>
          <Button variant='outline' size='sm'>
            <Home className='w-4 h-4' />
          </Button>
        </Link>
      </div>

      {/* Nội dung auth */}
      <div className='w-full max-w-md'>{children}</div>
    </div>
  )
}
