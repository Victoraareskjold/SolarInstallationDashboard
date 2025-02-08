"use client";
import useEmails from "@/hooks/useEmails";

export default function EmailPage() {
  const { emails, loading, error } = useEmails();

  if (loading) return <p>Laster inn e-poster...</p>;
  if (error) return <p>Feil: {error}</p>;

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📩 Innboks</h1>
      <ul className="space-y-4">
        {emails.map((email) => (
          <li key={email.id} className="p-3 border rounded shadow-sm">
            <p className="font-semibold">E-post-ID: {email.id}</p>
            <p className="text-gray-600">{email.snippet}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
