import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <header className="w-full bg-white shadow-md p-5">
        <h1 className="text-3xl font-bold text-center text-green-900">Welcome to AcePrep</h1>
    </header>

    <main className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">Your Journey to Success Starts Here!</h2>
        <p className="mt-3 text-center text-gray-600 max-w-lg">
            AcePrep is your one-stop solution for preparing for technical interviews. Get feedback, improve your skills, and ace your next interview with confidence!
        </p>
        <Link href="/dashboard">
        <div className="flex flex-col md:flex-row md:space-x-8 mt-6  bg-white shadow-md rounded-lg p-5 m-3 w-80 hover:bg-gray-800">
           Dashboard
            </div>
            </Link>
        <div className="flex flex-col md:flex-row md:space-x-8 mt-6">
            <div className="bg-white shadow-md rounded-lg p-5 m-3 w-80">
                <h3 className="text-xl font-semibold text-green-800">Feedback</h3>
                <p className="text-gray-600">
                    Receive personalized feedback on your interview performance to improve your skills.
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-5 m-3 w-80">
                <h3 className="text-xl font-semibold text-green-800">Mock Interviews</h3>
                <p className="text-gray-600">
                    Participate in mock interviews to simulate real interview conditions.
                </p>
            </div>
        </div>
    </main>

    <footer className="mt-10 w-full text-center p-4 bg-gray-200">
        <p className="text-gray-600">&copy; 2024 AcePrep. All rights reserved.</p>
    </footer>
</div>
  );
}
