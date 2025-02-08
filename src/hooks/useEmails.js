"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function useEmails() {
  const [emails, setEmails] = useState([]);
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

  return { emails, loading, error };
}
