import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Header } from "./dashboard/_components/Header";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata = {  
  title: "AcePrep | Elevate Your Interview Preparation",  
  description: "AcePrep is your go-to platform for AI-powered mock interviews, coding practice, quizzes, and expert guidance to crack top tech interviews.",  
  keywords: [
    "AcePrep",
    "Mock Interviews",
    "AI Interview Feedback",
    "DSA Practice",
    "Quizzes",
    "Software Engineering",
    "Tech Interviews",
    "Full-Stack Development",
    "MERN Stack",
    "Next.js",
    "JavaScript",
    "Coding Platform",
    "Career Prep",
  ],  
  openGraph: {
    title: "AcePrep | Elevate Your Interview Preparation",
    description: "AcePrep is your go-to platform for AI-powered mock interviews, coding practice, quizzes, and expert guidance to crack top tech interviews.",
    url: "https://aceprepkaran-lucx.vercel.app/",  // Update if needed
    type: "website",
    images: [
      {
        url: "https://photos.fife.usercontent.google.com/pw/AP1GczP3DE3kpLXWFTYZfHzGYDysfdnCrjctV91nNg-PQ_ftJl74EJhsV_lI=w958-h539-s-no-gm?authuser=0", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "AcePrep Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AcePrep | Elevate Your Interview Preparation",
    description: "AcePrep is your go-to platform for AI-powered mock interviews, coding practice, quizzes, and expert guidance to crack top tech interviews.",
    images: ["https://photos.fife.usercontent.google.com/pw/AP1GczP3DE3kpLXWFTYZfHzGYDysfdnCrjctV91nNg-PQ_ftJl74EJhsV_lI=w958-h539-s-no-gm?authuser=0"], // Ensure it's a valid absolute URL
  },
};


export default function RootLayout({ children }) {
  return (
 
 <ClerkProvider>
 <html lang="en">
 <head>
      <meta name="google-site-verification" content="google880c9fd3ac54d264.html" />

        <link rel="icon" href="/karankumar.jpg" sizes="any" />
        <meta property="og:image" content="https://photos.fife.usercontent.google.com/pw/AP1GczP3DE3kpLXWFTYZfHzGYDysfdnCrjctV91nNg-PQ_ftJl74EJhsV_lI=w958-h539-s-no-gm?authuser=0" />
        <meta name="twitter:image" content="https://photos.fife.usercontent.google.com/pw/AP1GczP3DE3kpLXWFTYZfHzGYDysfdnCrjctV91nNg-PQ_ftJl74EJhsV_lI=w958-h539-s-no-gm?authuser=0" />
      </head>
   <body>
     
     {children}
     <Header/>
   </body>
 </html>
</ClerkProvider>


  );
}
