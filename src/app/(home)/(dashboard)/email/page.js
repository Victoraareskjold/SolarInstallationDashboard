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

  const getDateHeader = (headers) => {
    const fromDate = headers.find((header) => header.name === "Date");
    if (fromDate) {
      const date = new Date(fromDate.value);
      return date.toLocaleDateString("nb-NO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return null;
  };

  console.log(emails);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">📩 Innboks</h1>
      <Link href="/email/send" className="darkButton ">
        Send email
      </Link>
      <section className="">
        <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {emails.map((thread) => (
            <Link
              href={`/email/${thread.threadId}`}
              key={thread.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold truncate">
                  {getFromHeader(thread.payload.headers)}
                </h3>

                <div
                  dangerouslySetInnerHTML={{
                    __html: thread.snippet,
                  }}
                  className="line-clamp-3 text-gray-600"
                />
              </div>
              <div className="bg-slate-200 w-fit py-1 px-3 rounded-full text-sm font-medium mt-4">
                {getDateHeader(thread.payload.headers)}
              </div>
            </Link>
          ))}
        </ul>
      </section>
    </main>
  );
}
