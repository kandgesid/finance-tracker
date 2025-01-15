'use client'

import { useClerk } from '@clerk/nextjs'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  return (
    <button onClick={() => signOut({ redirectUrl: "/" })} className='bg-blue-600 rounded-sm'>
      Sign out
    </button>
  )
}