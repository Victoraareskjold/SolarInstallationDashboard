import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFirestoreCollection = (
  db,
  collectionName,
  whereClause = null
) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let ref = collection(db, collectionName);

        if (whereClause) {
          ref = query(ref, where(...whereClause));
        }

        const snapshot = await getDocs(ref);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(docs);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [db, collectionName, whereClause]);

  return { data, error, loading };
};
