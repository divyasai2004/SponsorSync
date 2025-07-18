"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatBubbleLeftRightIcon, ArrowLeftIcon, PaperAirplaneIcon, PlusCircleIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Messages() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [startingNew, setStartingNew] = useState(false);

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
    fetch("http://localhost:5000/api/messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setThreads(data.threads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const selectThread = async (thread: any) => {
    setSelectedThread(thread);
    setMessages([]);
    setError("");
    setSuccess("");
    setNewMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${thread._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError("Failed to load messages");
    }
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: startingNew ? undefined : selectedThread.participants.find((p: any) => p.email !== email)._id,
          message: newMessage,
          ...(startingNew && { recipientEmail, message: newMessage }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSuccess("Message sent!");
      setNewMessage("");
      if (startingNew) {
        setStartingNew(false);
        setRecipientEmail("");
        setThreads((prev) => [...prev, data.thread]);
        setSelectedThread(data.thread);
        setMessages(data.thread.messages);
      } else {
        setMessages((prev) => [...prev, { sender: { email }, text: newMessage, timestamp: new Date() }]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleStartNew = async (e: any) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      // Find recipientId by email
      const resUser = await fetch(`http://localhost:5000/api/users/by-email/${recipientEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await resUser.json();
      if (!resUser.ok) throw new Error(userData.error || "User not found");
      const recipientId = userData.user._id;
      // Send message
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId, message: newMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSuccess("Message sent!");
      setNewMessage("");
      setStartingNew(false);
      setRecipientEmail("");
      setThreads((prev) => [...prev, data.thread]);
      setSelectedThread(data.thread);
      setMessages(data.thread.messages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-2">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl border border-purple-100 p-10 flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 w-full">
          <div className="flex items-center gap-3 mb-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-purple-500" />
            <h2 className="text-4xl font-extrabold tracking-tight text-purple-700">Messages</h2>
          </div>
          <button onClick={() => { setStartingNew(true); setSelectedThread(null); setMessages([]); setError(""); setSuccess(""); }}
            className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition text-lg">
            <PlusCircleIcon className="h-6 w-6" /> New Message
          </button>
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? <p className="text-gray-400 text-lg">Loading threads...</p> :
              threads.length === 0 ? <p className="text-gray-400 text-lg">No threads yet.</p> :
                threads.map((thread, idx) => (
                  <div key={thread._id || idx} className={`p-4 rounded-xl mb-3 cursor-pointer border ${selectedThread && selectedThread._id === thread._id ? 'bg-purple-100 border-purple-400' : 'bg-purple-50 border-purple-200'} hover:bg-purple-200 transition`} onClick={() => selectThread(thread)}>
                    <div className="flex items-center gap-2 font-semibold text-purple-700 text-base">
                      <UserCircleIcon className="h-6 w-6 text-purple-400" />
                      {thread.participants.filter((p: any) => p.email !== email).map((p: any) => p.email).join(", ")}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{thread.messages.length} messages</div>
                  </div>
                ))}
          </div>
        </div>
        <div className="md:w-2/3 w-full flex flex-col">
          {startingNew ? (
            <form onSubmit={handleStartNew} className="flex flex-col gap-6 bg-purple-50 border border-purple-200 rounded-2xl p-8 shadow-inner">
              <div>
                <label className="font-medium mb-1 text-purple-700">Recipient Email</label>
                <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} required className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white" />
              </div>
              <div>
                <label className="font-medium mb-1 text-purple-700">Message</label>
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} required className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white" />
              </div>
              <button type="submit" disabled={sending} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl font-semibold text-lg shadow hover:from-purple-600 hover:to-blue-600 transition flex items-center gap-2 justify-center">
                <PaperAirplaneIcon className="h-6 w-6" /> {sending ? "Sending..." : "Send"}
              </button>
              {error && <div className="w-full text-red-600 mt-2 text-center bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
              {success && <div className="w-full text-green-600 mt-2 text-center bg-green-50 border border-green-200 rounded-lg p-2">{success}</div>}
            </form>
          ) : selectedThread ? (
            <div className="flex flex-col h-full bg-blue-50 border border-blue-200 rounded-2xl p-8 shadow-inner">
              <div className="flex-1 overflow-y-auto mb-4 max-h-80">
                {messages.length === 0 ? <p className="text-gray-400 text-lg">No messages yet.</p> :
                  messages.map((msg, idx) => (
                    <div key={idx} className={`mb-3 flex ${msg.sender && msg.sender.email === email ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-xl px-4 py-3 max-w-[70%] ${msg.sender && msg.sender.email === email ? 'bg-blue-200 text-right' : 'bg-purple-200 text-left'} shadow`}> 
                        <div className="text-xs text-gray-600 mb-1">{msg.sender && msg.sender.email}</div>
                        <div className="text-base">{msg.text}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{msg.timestamp && new Date(msg.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-2 mt-auto">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} required className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white" placeholder="Type a message..." />
                <button type="submit" disabled={sending} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition flex items-center gap-2">
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              </form>
              {error && <div className="w-full text-red-600 mt-2 text-center bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
              {success && <div className="w-full text-green-600 mt-2 text-center bg-green-50 border border-green-200 rounded-lg p-2">{success}</div>}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-purple-50 border border-purple-200 rounded-2xl p-8 shadow-inner">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-purple-200 mb-4" />
              <p className="text-gray-400 text-lg">Select a thread or start a new message.</p>
            </div>
          )}
          <a href="/dashboard" className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg shadow hover:from-purple-600 hover:to-blue-600 transition">
            <ArrowLeftIcon className="h-5 w-5" /> Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 