import { SignIn, SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 h-screen relative">
        {/* Image Section */}
        <div className="relative h-full">
            <Image
                src="/Bnner.jpg"
                alt="login"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
            />
             
        </div>

        {/* SignIn Section */}
        <div className="absolute top-20 left-0 w-full h-full flex items-start justify-end p-6">
            <div className="max-w-md w-full backdrop-blur-lg p-6 rounded-lg shadow-lg">
                <SignUp />
            </div>
        </div>
    </div>
      )
}