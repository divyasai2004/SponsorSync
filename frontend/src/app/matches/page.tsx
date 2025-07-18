"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UsersIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const INDUSTRY_OPTIONS = ["All", "Tech", "Finance", "Education", "Healthcare", "Retail", "Other"];
const AUDIENCE_OPTIONS = ["All", "Students", "Professionals", "General Public", "Other"];

export default function Matches() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [industry, setIndustry] = useState("All");
  const [audience, setAudience] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userEmail = localStorage.getItem("userEmail");
    if (!token) {
      router.replace("/login");
      return;
    }
    setRole(userRole || "");
    setEmail(userEmail || "");
    setLoading(true);
    // Build query string
    const params = [];
    if (industry !== "All") params.push(`industry=${encodeURIComponent(industry)}`);
    if (audience !== "All") params.push(`audience=${encodeURIComponent(audience)}`);
    const query = params.length ? `?${params.join("&")}` : "";
    fetch(`http://localhost:5000/api/matches${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const sorted = (data.matches || []).sort((a: any, b: any) => (b.matchPercent || 0) - (a.matchPercent || 0));
        setMatches(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load matches");
        setLoading(false);
      });
  }, [router, industry, audience]);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-2">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl border border-green-100 p-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          <UsersIcon className="h-12 w-12 text-green-500" />
          <h2 className="text-4xl font-extrabold tracking-tight text-green-700">Matches</h2>
        </div>
        <div className="mb-2 text-2xl font-bold text-blue-700">
          {role === "studentClub" ? "Student Club Matches" : "Sponsor Matches"}
        </div>
        {email && <div className="mb-6 text-lg text-gray-600">Email: <span className="font-mono text-green-700">{email}</span></div>}
        {/* Filters */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center">
          <div>
            <label className="font-semibold text-gray-700 mr-2">Industry:</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)} className="border rounded-lg p-2 bg-green-50">
              {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-gray-700 mr-2">Audience:</label>
            <select value={audience} onChange={e => setAudience(e.target.value)} className="border rounded-lg p-2 bg-green-50">
              {AUDIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        {/* Active filters */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {industry !== "All" && <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">Industry: {industry}</span>}
          {audience !== "All" && <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">Audience: {audience}</span>}
        </div>
        <div className="w-full flex flex-col items-center">
          {loading ? (
            <p className="text-gray-400 text-lg">Loading matches...</p>
          ) : error ? (
            <p className="text-red-600 text-lg">{error}</p>
          ) : matches.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center p-8 bg-green-50 border border-green-200 rounded-2xl shadow-inner">
              <UsersIcon className="h-16 w-16 text-green-200 mb-4" />
              <p className="text-green-700 text-xl font-semibold mb-2">No matches found</p>
              <p className="text-gray-500">Once you connect with a sponsor or club, your matches will appear here!</p>
            </div>
          ) : (
            <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {matches.map((match, idx) => {
                const other = role === "studentClub" ? match.sponsor : match.studentClub;
                return (
                  <li key={match._id || idx} className="p-6 rounded-2xl bg-white border border-green-200 shadow flex flex-col gap-2 items-start hover:shadow-lg transition relative">
                    <div className="flex items-center gap-3 mb-2">
                      <UsersIcon className="h-8 w-8 text-green-500" />
                      <span className="font-bold text-green-700 text-lg">{other.email}</span>
                    </div>
                    <div className="text-sm text-gray-500">Role: {role === "studentClub" ? "Sponsor" : "Student Club"}</div>
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-sm shadow">
                      {match.matchPercent || 0}% Match
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <a href="/dashboard" className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold text-lg shadow hover:from-green-600 hover:to-blue-600 transition">
          <ArrowLeftIcon className="h-5 w-5" /> Back to Dashboard
        </a>
      </div>
    </div>
  );
} 