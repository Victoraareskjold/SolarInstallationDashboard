import { useEffect, useState } from "react";

const useThread = (userId, provider, conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !provider || !conversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/${provider}/getThread?userId=${userId}&conversationId=${conversationId}`
        );
        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          setError("Kunne ikke hente e-poster.");
        }
      } catch (err) {
        setError("Feil ved henting av e-poster.");
        console.error("Feil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId, provider, conversationId]);

  return { messages, loading, error };
};

export default useThread;
