"use client";
import useEmails from "@/hooks/useEmails";
import Link from "next/link";

export default function EmailPage() {
  const { emails, loading, error } = useEmails();

  if (loading) return <p>Laster inn e-poster...</p>;
  if (error) return <p>Feil: {error}</p>;

  const getFromHeader = (headers) => {
    const fromHeader = headers.find((header) => header.name === "From");
    return fromHeader ? fromHeader.value : null;
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">📩 Innboks</h1>
      <Link href="/email/send" className="darkButton ">
        Send email
      </Link>
      <section className="">
        <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {emails.map((thread) => (
            <li
              key={thread.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-lg font-semibold truncate">
                {getFromHeader(thread.payload.headers)}
              </h3>
              {/* <p className="line-clamp-3 mb-4 text-gray-600">
                {thread.snippet}
              </p> */}
              <div
                dangerouslySetInnerHTML={{
                  __html: thread.snippet,
                }}
                className="line-clamp-3 text-gray-600"
              />
              <Link href={`/email/${thread.id}`} className="darkButton">
                Se samtale
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
