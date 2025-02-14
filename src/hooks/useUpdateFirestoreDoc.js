import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export const useUpdateFirestoreDoc = (db, collectionName) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateDocData = async (docId, data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return { updateDocData, error, loading, success };
};
