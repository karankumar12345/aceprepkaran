import React, { Children } from 'react'
import { Header } from './_components/Header'
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
const DashboardLayout = ({children}) => {
  return (
    <div className='bg-gray-900 overflow-hidden overflow-x-hidden overflow-y-hidden' >
   
     <div className='mx-5 md:mx-20 lg:mx-30  bg-gray-900  mt-[100px]'> {children}</div>
     <Toaster />
     

<div className='fixed top-10 left-20'>
<UserButton/>
</div>

    </div>
    
  )
}

export default DashboardLayout
