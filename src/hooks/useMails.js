import { useEffect, useState } from "react";

const useMails = (userId, provider) => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !provider) return;

    const fetchMails = async () => {
      try {
        const response = await fetch(
          `/api/${provider}/getMails?userId=${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setMails(data.mails);
        }
      } catch (err) {
        setError("Feil ved henting av e-poster.");
        console.error("Feil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [userId, provider]);

  return { mails, loading, error };
};

export default useMails;
