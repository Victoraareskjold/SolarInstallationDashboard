"use client";

import { useAuth } from "@/context/AuthContext";
import useEmails from "@/hooks/useEmails";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ThreadView() {
  const { threadId } = useParams();
  const {
    conversation = [],
    loading: useEmailsLoading,
    error,
  } = useEmails(threadId);
  const { user } = useAuth();

  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) return <p>Laster samtale...</p>;
  if (error) return <p>Feil: {error}</p>;

  const handleSendReply = async () => {
    setLoading(true);

    try {
      const lastMessage = conversation[conversation.length - 1];
      const messageId = lastMessage?.id;
      const to = lastMessage?.from;

      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          to,
          subject: `Re: ${lastMessage.subject}`,
          message: reply,
          threadId,
          inReplyTo: messageId,
        }),
      });

      if (!response.ok) {
        throw new Error("Feil ved sending av svaret!");
      }

      setReply("");
    } catch (err) {
      console.error("Feil ved sending av svar: ", err);
    }

    setLoading(false);
  };

  const removeInlineStyles = (htmlContent) => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    const styleTags = element.querySelectorAll("style");
    styleTags.forEach((tag) => tag.remove());

    const allElements = element.querySelectorAll("*");
    allElements.forEach((el) => el.removeAttribute("style"));

    return element.innerHTML;
  };

  console.log(conversation);

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

  const formatDate = (date) => {
    if (date) {
      const newDate = new Date(date);
      return newDate.toLocaleDateString("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return null;
  };

  const sortedConversation = [...conversation].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">📩 Samtale</h1>
      <p>{threadId || "no thread id"}</p>
      {sortedConversation.map((msg) => (
        <div key={msg.id} className="border p-4 rounded shadow mb-4">
          <h2 className="text-lg font-bold">{msg.subject || "Ingen emne"}</h2>
          <p>
            <strong>Fra:</strong> {msg.from}
          </p>
          <p className="h-full w-full">{msg.content}</p>
          <p className="h-full w-full">{formatDate(msg.date)}</p>

          <div
            dangerouslySetInnerHTML={{
              __html: msg.body || "<p>(Ingen innhold tilgjengelig)</p>",
            }}
            style={{ all: "initial" }}
          />
        </div>
      ))}
      <div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows="3"
          placeholder="Your reply..."
          className="input w-full"
        />
        <button
          disabled={loading}
          onClick={handleSendReply}
          className="darkButton"
        >
          Send
        </button>
      </div>
    </section>
  );
}
