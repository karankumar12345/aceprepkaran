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
  title: "ACEPREP",
  description: "ai mock website ",
};

export default function RootLayout({ children }) {
  return (
 
 <ClerkProvider>
 <html lang="en">
   <body>
     
     {children}
     <Header/>
   </body>
 </html>
</ClerkProvider>


  );
}
