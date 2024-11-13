import React, { Children } from 'react'
import { Header } from './_components/Header'
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
const DashboardLayout = ({children}) => {
  return (
    <div>
      <Header/>
     <div className='mx-5 md:mx-20 lg:mx-30 mt-20'> {children}</div>
     <Toaster />
     <Link href="https://www.linkedin.com/in/karan-kumar-823190256/" target="_blank"
    
          className="absolute bottom-1 right-20 p-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
            💘🥰Karan 
          
        </Link>
        <div   className="absolute top-5 right-4 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
        <UserButton/>
        </div>
    </div>
    
  )
}

export default DashboardLayout
