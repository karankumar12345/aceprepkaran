import Image from "next/image";
import Link from "next/link";
import HowItsWork from "./_components/HowItsWork";
import Feature from "./_components/Feature";
import AskedQuestion from "./_components/AskedQuestion";
import Footer from "./_components/Footer";
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
          <div className="  md:space-x-8 mt-6  text-center text-gray-200 bg-gray-900 shadow-md rounded-lg p-5 m-3 w-80  border border-cyan-500 hover:scale-[1.1]">
            Dashboard
          </div>
        </Link>
        <HowItsWork />
      <Feature/>
      <AskedQuestion/>
   
      </main>

   <Footer/>
    </div>
  );
}
