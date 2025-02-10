import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useGetMailProvider = (userId) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const mailTokens = userDoc.data().mailTokens;
          if (mailTokens) {
            const providers = Object.keys(mailTokens);
            if (providers.length > 0) {
              setProvider(providers[0]);
            }
          }
        }
      } catch (error) {
        console.error("Feil ved henting av provider:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProvider();
    }
  }, [userId]);

  return { provider, loading };
};
