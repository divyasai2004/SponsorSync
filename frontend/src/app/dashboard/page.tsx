"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, BuildingStorefrontIcon, ChatBubbleLeftRightIcon, UsersIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    if (!token) {
      router.replace("/login");
    } else {
      setEmail(userEmail || "");
      setRole(userRole || "");
    }
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8 px-2">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          {role === "studentClub" ? <UserCircleIcon className="h-10 w-10 text-blue-500" /> : <BuildingStorefrontIcon className="h-10 w-10 text-purple-500" />}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-700">Dashboard</h2>
        </div>
        <div className="mb-4 text-lg sm:text-2xl font-semibold text-purple-700 text-center">
          Welcome, <span className="text-blue-700">{email}</span>!
        </div>
        <div className="mb-8 text-gray-600 text-base sm:text-lg text-center">Role: <span className="font-mono text-blue-700">{role}</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <a href="/profile" className="group p-6 rounded-2xl bg-blue-50 border border-blue-200 shadow hover:shadow-lg hover:bg-blue-100 transition flex flex-col items-center text-center">
            <UserCircleIcon className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition" />
            <div className="font-bold text-blue-700 mb-1 text-base sm:text-lg">Manage Profile</div>
            <div className="text-sm text-gray-500">Edit your details and showcase your brand or club.</div>
            <ArrowRightIcon className="h-5 w-5 text-blue-400 mt-2 group-hover:translate-x-1 transition" />
          </a>
          <a href="/messages" className="group p-6 rounded-2xl bg-purple-50 border border-purple-200 shadow hover:shadow-lg hover:bg-purple-100 transition flex flex-col items-center text-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500 mb-2 group-hover:scale-110 transition" />
            <div className="font-bold text-purple-700 mb-1 text-base sm:text-lg">Messages</div>
            <div className="text-sm text-gray-500">Chat with sponsors or clubs directly.</div>
            <ArrowRightIcon className="h-5 w-5 text-purple-400 mt-2 group-hover:translate-x-1 transition" />
          </a>
          <a href="/matches" className="group p-6 rounded-2xl bg-green-50 border border-green-200 shadow hover:shadow-lg hover:bg-green-100 transition flex flex-col items-center text-center">
            <UsersIcon className="h-8 w-8 text-green-500 mb-2 group-hover:scale-110 transition" />
            <div className="font-bold text-green-700 mb-1 text-base sm:text-lg">View Matches</div>
            <div className="text-sm text-gray-500">See your sponsorship matches and connections.</div>
            <ArrowRightIcon className="h-5 w-5 text-green-400 mt-2 group-hover:translate-x-1 transition" />
          </a>
        </div>
      </div>
    </div>
  );
} 