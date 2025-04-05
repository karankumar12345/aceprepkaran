import { GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="bg-black text-white w-full flex flex-col md:flex-row items-center justify-around p-6 mt-10">
      
      <div className="flex flex-col gap-2 items-start">
        <Link href="https://www.instagram.com/karankumar26082005" target="_blank">
          <p className="flex items-center gap-2 hover:text-pink-400">
            <InstagramLogoIcon />
            Instagram
          </p>
        </Link>

        <Link href="https://www.linkedin.com/in/karan-kumar-823190256/" target="_blank">
          <p className="flex items-center gap-2 hover:text-blue-400">
            <LinkedInLogoIcon />
            LinkedIn
          </p>
        </Link>

        <Link href="https://github.com/karankumar12345" target="_blank">
          <p className="flex items-center gap-2 hover:text-gray-400">
            <GitHubLogoIcon />
            GitHub
          </p>
        </Link>
      </div>

      <footer className="text-center mt-4 md:mt-0">
        <p className="text-gray-400 text-2xl">
          &copy; 2025 AcePrep. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Footer
