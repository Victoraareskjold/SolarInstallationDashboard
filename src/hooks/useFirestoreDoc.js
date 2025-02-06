import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFirestoreDoc = (db, collection, docId) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const docRef = doc(db, collection, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          throw new Error("Dokumentet finnes ikke");
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    if (docId) {
      fetchData();
    }
  }, [db, collection, docId]);

  const updateDocData = async (newData) => {
    try {
      const docRef = doc(db, collection, docId);
      await setDoc(docRef, newData, { merge: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, error, loading, setLoading, updateDocData };
};
