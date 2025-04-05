import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 h-screen relative">
            {/* Image Section */}


            {/* SignIn Section */}
            <div className="absolute top-20 left-0 w-full h-full flex items-start justify-center p-6">
             
                    <SignIn />
              
            </div>
        </div>
    );
}
