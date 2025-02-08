"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function useEmails(threadId) {
  const [emails, setEmails] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmails = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/getEmails?userId=${user.uid}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        setEmails(data.emails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [user]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!user || !threadId) return;
      try {
        const response = await fetch(
          `/api/getThread?userId=${user.uid}&threadId=${threadId}`
        );
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        setConversation(data.conversation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [user, threadId]);

  return { emails, conversation, loading, error };
}
