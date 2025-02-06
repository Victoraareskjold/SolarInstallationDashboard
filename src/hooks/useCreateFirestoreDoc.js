import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

export const useCreateFirestoreDoc = (db, collectionName) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createDoc = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, collectionName), data);

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return { createDoc, error, loading, success };
};
