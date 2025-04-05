import Image from "next/image";
import Link from "next/link";
import HowItsWork from "./_components/HowItsWork";
import Feature from "./_components/Feature";
import AskedQuestion from "./_components/AskedQuestion";
import Footer from "./_components/Footer";
import { Code, Laptop2, ListChecks, Terminal } from "lucide-react";
// import HowItsWork fro./_components/HowItsWorkork";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <header className="w-full bg-gray-900 shadow-md p-5">
        <h1 className="text-3xl font-bold text-center text-green-900">
          Welcome to AcePrep
        </h1>
      </header>

      <main className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-semibold text-gray-100">
          Your Journey to Success Starts Here!
        </h2>
        <p className="mt-3 text-center text-gray-300 max-w-lg">
          AcePrep is your one-stop solution for preparing for technical
          interviews. Get feedback, improve your skills, and ace your next
          interview with confidence!
        </p>
        <img src="https://www.ttnews.com/sites/default/files/2023-09/iTECH-Dysart-1200.jpg" className=" m-5 w-[300px] h-[400px] rounded-full shadow-[1px_1px_48px_-6px_#ff24e1b3]"/>
        <Link href="/dashboard" className="flex items-center justify-center">
          <div className="  md:space-x-8 mt-6  text-center text-gray-200 bg-red-800 shadow-md rounded-full p-5 m-3 w-80  border border-cyan-500 hover:scale-[1.1]">
            Dashboard
          </div>
          </Link>
          <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center text-white">
        What type of interview do you want?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
        <Link
          href="/dashboard/dsa"
          className="flex items-center gap-4 p-4 bg-blue-100 rounded-2xl hover:bg-blue-200 transition duration-300 shadow-md"
        >
          <Code className="w-6 h-6 text-blue-700" />
          <span className="text-lg font-medium">DSA Interview</span>
        </Link>

        <Link
          href="/dashboard/dsamcq"
          className="flex items-center gap-4 p-4 bg-green-100 rounded-2xl hover:bg-green-200 transition duration-300 shadow-md"
        >
          <ListChecks className="w-6 h-6 text-green-700" />
          <span className="text-lg font-medium">DSA MCQ</span>
        </Link>

        <Link
          href="/dashboard/development"
          className="flex items-center gap-4 p-4 bg-yellow-100 rounded-2xl hover:bg-yellow-200 transition duration-300 shadow-md"
        >
          <Laptop2 className="w-6 h-6 text-yellow-700" />
          <span className="text-lg font-medium">Development MCQ</span>
        </Link>

        <Link
          href="/dashboard/development-mcq"
          className="flex items-center gap-4 p-4 bg-purple-100 rounded-2xl hover:bg-purple-200 transition duration-300 shadow-md"
        >
          <Terminal className="w-6 h-6 text-purple-700" />
          <span className="text-lg font-medium">Development Interview</span>
        </Link>
      </div>
    </div>
     
        <HowItsWork />
      <Feature/>
      <AskedQuestion/>
   
      </main>

   <Footer/>
    </div>
  );
}
