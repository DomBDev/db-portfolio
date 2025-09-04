"use client";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.includes("@") || !subject.trim() || message.trim().length < 10) {
      setError("Please complete the form correctly.");
      return;
    }
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      setError("One of the fields is too long.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, honeypot }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Request failed");
      }
      setStatus("success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <input 
        type="text" 
        name="honeypot" 
        value={honeypot} 
        onChange={(e) => setHoneypot(e.target.value)} 
        style={{display:"none"}} 
        aria-hidden 
      />
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name
            <input 
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              maxLength={100} 
              required
              className="mt-1 block w-full rounded border border-brand/20 bg-body px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" 
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
            <input 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              type="email" 
              required
              className="mt-1 block w-full rounded border border-brand/20 bg-body px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" 
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Subject
            <input 
              value={subject} 
              onChange={(e)=>setSubject(e.target.value)} 
              maxLength={200} 
              required
              className="mt-1 block w-full rounded border border-brand/20 bg-body px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" 
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Message
            <textarea 
              value={message} 
              onChange={(e)=>setMessage(e.target.value)} 
              minLength={10} 
              maxLength={5000} 
              required
              rows={6}
              className="mt-1 block w-full rounded border border-brand/20 bg-body px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-y" 
            />
          </label>
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </div>

      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Message sent successfully. Thank you for reaching out!
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Error: {error}
        </p>
      )}
    </form>
  );
}
