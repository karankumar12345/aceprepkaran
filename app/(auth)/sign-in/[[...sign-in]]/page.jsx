import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 bg-gray-900 text-white h-screen relative">
            {/* Image Section */}


            {/* SignIn Section */}
            <div className="absolute top-20 left-0 w-full h-full flex items-start justify-center p-6 bg-gray-900 text-white">
             
                    <SignIn  className="bg-gray-900 text-white"/>
              
            </div>
        </div>
    );
}
