import Link from "next/link";

export default function OutlookInboxView({ mails }) {
  const getDateFormatted = (timestamp) => {
    if (!timestamp) return "Ukjent dato";

    const date = new Date(timestamp);
    return date.toLocaleDateString("nb-NO", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedMails = [...mails].sort((a, b) => {
    const dateA = new Date(a.receivedDateTime);
    const dateB = new Date(b.receivedDateTime);
    return dateB - dateA;
  });

  return (
    <section>
      <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedMails.map((thread) => (
          <Link
            href={`/email/${thread.threadId}`}
            key={thread.id}
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold truncate">{thread.to}</h3>

              <div
                dangerouslySetInnerHTML={{
                  __html: thread.bodyPreview,
                }}
                className="line-clamp-3 text-gray-600"
              />
            </div>
            <div className="bg-slate-200 w-fit py-1 px-3 rounded-full text-sm font-medium mt-4">
              {getDateFormatted(thread.receivedDateTime)}
            </div>
          </Link>
        ))}
      </ul>
    </section>
  );
}
