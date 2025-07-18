import Link from "next/link";
import { UserGroupIcon, ChatBubbleLeftRightIcon, SparklesIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <section className="w-full max-w-4xl flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex items-center gap-4 mb-6">
          <span className="inline-block h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-4xl shadow-lg">
            SS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-700">SponsorSync</h1>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-purple-700 mb-4">Smart Sponsorship & Brand Matchmaking Engine</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Connect student clubs and sponsors for smarter, easier event partnerships. Discover, match, and collaborate with the right brands or clubs for your next big event.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/register" className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow hover:from-blue-600 hover:to-purple-600 transition">Get Started</Link>
          <Link href="/login" className="px-8 py-3 rounded-lg border-2 border-blue-500 text-blue-700 font-semibold text-lg hover:bg-blue-50 transition">Login</Link>
        </div>
        <div className="w-full max-w-3xl mt-12">
          <h3 className="text-xl font-bold text-blue-700 mb-6">How SponsorSync Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-12 w-12 text-purple-500 mb-2" />
              <div className="font-semibold text-lg mb-1">Create Your Profile</div>
              <div className="text-gray-500 text-sm">Student clubs and sponsors set up detailed profiles to showcase their needs and offerings.</div>
            </div>
            <div className="flex flex-col items-center">
              <SparklesIcon className="h-12 w-12 text-green-500 mb-2" />
              <div className="font-semibold text-lg mb-1">Smart Matchmaking</div>
              <div className="text-gray-500 text-sm">Our engine connects the right clubs and brands for meaningful partnerships.</div>
            </div>
            <div className="flex flex-col items-center">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-500 mb-2" />
              <div className="font-semibold text-lg mb-1">Easy Messaging</div>
              <div className="text-gray-500 text-sm">Chat, negotiate, and collaborate directly within the platform.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
