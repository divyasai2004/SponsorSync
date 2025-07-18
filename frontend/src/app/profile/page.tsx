"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, BuildingStorefrontIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const studentClubFields = [
  { name: "eventName", label: "Event Name", required: true },
  { name: "description", label: "Description", required: true },
  { name: "theme", label: "Theme", required: true },
  { name: "targetAudience", label: "Target Audience", required: true },
  { name: "expectedReach", label: "Expected Reach", required: true, type: "number" },
  { name: "socialStats", label: "Social Stats" },
  { name: "pastEvents", label: "Past Events" },
  { name: "sponsorshipRequirements", label: "Sponsorship Requirements", required: true },
];
const sponsorFields = [
  { name: "brandName", label: "Brand Name", required: true },
  { name: "website", label: "Website" },
  { name: "industry", label: "Industry", required: true },
  { name: "targetAudience", label: "Target Audience", required: true },
  { name: "goals", label: "Goals", required: true },
  { name: "region", label: "Region" },
  { name: "budget", label: "Budget" },
];

export default function Profile() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    fetch("http://localhost:5000/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setProfile(data.studentClubProfile || data.sponsorProfile || {});
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      setSuccess("Profile saved successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = role === "studentClub" ? studentClubFields : sponsorFields;

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8 px-2">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          {role === "studentClub" ? <UserCircleIcon className="h-12 w-12 text-blue-500" /> : <BuildingStorefrontIcon className="h-12 w-12 text-purple-500" />}
          <h2 className="text-4xl font-extrabold tracking-tight text-blue-700">Profile Management</h2>
        </div>
        <div className="mb-2 text-2xl font-bold text-purple-700">
          {role === "studentClub" ? "Student Club Profile" : "Sponsor Profile"}
        </div>
        {email && <div className="mb-6 text-lg text-gray-600">Email: <span className="font-mono text-blue-700">{email}</span></div>}
        <div className="w-full flex flex-col items-center">
          {loading ? (
            <p className="text-gray-400 text-lg">Loading profile...</p>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {fields.map(f => (
                  <div key={f.name} className="flex flex-col items-start w-full">
                    <label className="font-medium mb-1 text-blue-700" htmlFor={f.name}>{f.label}{f.required && <span className="text-red-500">*</span>}</label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type || "text"}
                      value={profile[f.name] || ""}
                      onChange={handleChange}
                      required={f.required}
                      className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                    />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={saving} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl font-semibold text-lg shadow hover:from-blue-600 hover:to-purple-600 transition">
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {error && <div className="w-full text-red-600 mt-2 text-center bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
              {success && <div className="w-full text-green-600 mt-2 text-center bg-green-50 border border-green-200 rounded-lg p-2">{success}</div>}
            </form>
          )}
        </div>
        <a href="/dashboard" className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow hover:from-blue-600 hover:to-purple-600 transition">
          <ArrowLeftIcon className="h-5 w-5" /> Back to Dashboard
        </a>
      </div>
    </div>
  );
} 