"use client";

import useEmails from "@/hooks/useEmails";
import { useParams } from "next/navigation";

export default function ThreadView() {
  const { threadId } = useParams();
  const { conversation = [], loading, error } = useEmails(threadId);

  if (loading) return <p>Laster samtale...</p>;
  if (error) return <p>Feil: {error}</p>;

  const removeInlineStyles = (htmlContent) => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    const styleTags = element.querySelectorAll("style");
    styleTags.forEach((tag) => tag.remove());

    const allElements = element.querySelectorAll("*");
    allElements.forEach((el) => el.removeAttribute("style"));

    return element.innerHTML;
  };

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">📩 Samtale</h1>
      <p>{threadId || "no thread id"}</p>
      {conversation.map((msg) => (
        <div key={msg.id} className="border p-4 rounded shadow mb-4">
          <h2 className="text-lg font-bold">{msg.subject || "Ingen emne"}</h2>
          <p>
            <strong>Fra:</strong> {msg.from}
          </p>
          <p className="h-full w-full">{msg.content}</p>

          <div
            dangerouslySetInnerHTML={{
              __html: msg.body || "<p>(Ingen innhold tilgjengelig)</p>",
            }}
            style={{ all: "initial" }}
          />
          {/* <div
            dangerouslySetInnerHTML={{
              __html: removeInlineStyles(
                msg.body || "<p>(Ingen innhold tilgjengelig)</p>"
              ),
            }}
          /> */}
        </div>
      ))}
    </section>
  );
}
