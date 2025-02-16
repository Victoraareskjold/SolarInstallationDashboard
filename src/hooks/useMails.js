import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

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
          if (provider == "google") {
            console.error(
              "Fiks opp i dette, ikke noe problem men må gjøres noe med!"
            );
            setMails(data.mails);
          } else {
            const emailRef = collection(db, "emails");
            const emailSnapshot = query(
              emailRef,
              where("userId", "==", userId)
            );
            const snapshot = await getDocs(emailSnapshot);
            const userEmails = snapshot.docs.map((doc) => doc.data().to);

            const userRef = doc(db, "users", userId);
            const userSnapShot = await getDoc(userRef);
            const userEmail = userSnapShot.data()?.email;

            console.log(userEmail);

            const filteredMails = data.mails.filter((mail) => {
              const fromEmail = mail.from?.emailAddress?.address;
              const toEmails =
                mail.toRecipients.map((to) => to.emailAddress.address) || [];

              return (
                fromEmail === userEmail ||
                toEmails.includes(userEmail) ||
                fromEmail === clientEmail ||
                toEmails.includes(clientEmail)
              );
            });

            setMails(filteredMails);
          }
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
