"use client";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full px-4 py-3 bg-white/80 shadow-md flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="inline-block h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-2xl shadow">
          SS
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-blue-700">SponsorSync</span>
      </div>
      {/* Desktop Nav */}
      <div className="hidden md:flex gap-4 items-center text-base font-medium">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
        <Link href="/profile" className="hover:text-blue-600 transition">Profile</Link>
        <Link href="/messages" className="hover:text-blue-600 transition">Messages</Link>
        <Link href="/matches" className="hover:text-blue-600 transition">Matches</Link>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">Logout</button>
      </div>
      {/* Hamburger Icon */}
      <button className="md:hidden p-2 rounded focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
        {menuOpen ? <XMarkIcon className="h-7 w-7 text-blue-700" /> : <Bars3Icon className="h-7 w-7 text-blue-700" />}
      </button>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="w-64 bg-white h-full shadow-lg flex flex-col gap-4 p-6" onClick={e => e.stopPropagation()}>
            <button className="self-end mb-4" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <XMarkIcon className="h-7 w-7 text-blue-700" />
            </button>
            <Link href="/" className="hover:text-blue-600 transition py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link href="/profile" className="hover:text-blue-600 transition py-2" onClick={() => setMenuOpen(false)}>Profile</Link>
            <Link href="/messages" className="hover:text-blue-600 transition py-2" onClick={() => setMenuOpen(false)}>Messages</Link>
            <Link href="/matches" className="hover:text-blue-600 transition py-2" onClick={() => setMenuOpen(false)}>Matches</Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
} 