"use client";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);

          if (user) {
            const organizationId = await getUserOrganization(user.uid);
            if (organizationId) {
              setOrganizationId(organizationId);
            } else {
              setOrganizationId(null);
            }
          }

          setLoading(false);
        });

        return () => unsubscribe();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getUserOrganization = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const organizationId = userData.organizationId;

        const organizationRef = doc(db, "organizations", organizationId);
        const organizationDoc = await getDoc(organizationRef);

        if (organizationDoc.exists()) return organizationId;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user organization:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, organizationId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
