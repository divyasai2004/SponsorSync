"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full px-4 py-3 bg-white/80 shadow-md flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="inline-block h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-2xl shadow">
          SS
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-blue-700">SponsorSync</span>
      </div>
      <div className="flex gap-4 items-center text-base font-medium">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
        <Link href="/profile" className="hover:text-blue-600 transition">Profile</Link>
        <Link href="/messages" className="hover:text-blue-600 transition">Messages</Link>
        <Link href="/matches" className="hover:text-blue-600 transition">Matches</Link>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">Logout</button>
      </div>
    </nav>
  );
} 