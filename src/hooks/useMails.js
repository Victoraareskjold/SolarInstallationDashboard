import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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
          const emailsRef = collection(db, "emails");
          const q = query(emailsRef, where("userId", "==", userId));
          const snapshot = await getDocs(q);
          const userEmails = snapshot.docs.map((doc) => doc.data().to);

          const filteredMails = data.mails.filter((mail) =>
            // Outlook filter for checking recipient compared to db
            mail.toRecipients.some((to) =>
              userEmails.includes(to.emailAddress.address)
            )
          );
          setMails(filteredMails);
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

    fetchMails();
  }, [userId, provider]);

  return { mails, loading, error };
};

export default useMails;
