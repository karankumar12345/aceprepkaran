import { SignIn, SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 h-screen relative bg-gray-900 text-white">
    

        {/* SignIn Section */}
        <div className="absolute top-20 left-0 w-full h-full flex items-start justify-end p-6">

                <SignUp />
         
        </div>
    </div>
      )
}