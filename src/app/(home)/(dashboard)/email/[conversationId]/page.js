"use client";

import { useAuth } from "@/context/AuthContext";
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import { useParams } from "next/navigation";
import { useState } from "react";
import useThread from "@/hooks/useThread";

export default function ThreadView() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const { provider: currentProvider, loading: providerLoading } =
    useGetMailProvider(user?.uid);

  const {
    messages,
    loading: useEmailsLoading,
    error,
  } = useThread(user?.uid, currentProvider, conversationId);

  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  if (useEmailsLoading) return <p>Laster meldinger...</p>;
  if (error) return <p>Feil: {error}</p>;

  const handleSendReply = async () => {
    setLoading(true);

    try {
      const lastMessage = messages[messages.length - 1];
      const messageId = lastMessage?.id;
      const to = lastMessage?.from;

      const response = await fetch(`/api/${currentProvider}/sendMail`, {
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

  /* const sortedConversation = [...messages].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  }); */

  console.log(messages.mails);

  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">📩 Samtale</h1>
      <h2>{messages.mails[0].subject}</h2>
      <ul className="flex flex-col gap-2">
        {messages.mails.map((msg) => (
          <li key={msg.id} className="bg-slate-200 p-2 rounded-xl">
            <div
              dangerouslySetInnerHTML={{
                __html: msg.body.content,
              }}
              className="line-clamp-3 text-gray-600"
            />
            <p>{formatDate(msg.sentDateTime)}</p>
          </li>
        ))}
      </ul>
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
