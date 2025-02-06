"use client";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const getOrCreateOrganization = async (email) => {
    const domain = email.split("@")[1];
    const organization = domain.split(".")[0];

    const organizationQuery = query(
      collection(db, "organizations"),
      where("organization", "==", organization)
    );
    const orgnizationSnapshot = await getDocs(organizationQuery);
    if (!orgnizationSnapshot.empty) {
      return orgnizationSnapshot.docs[0].id;
    }

    const newOrganizationRef = doc(collection(db, "organizations"));
    await setDoc(newOrganizationRef, {
      organization: organization,
      createdAt: new Date(),
    });
    return { id: newOrganizationRef.id, name: organization };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const organizationId = await getOrCreateOrganization(user.email);

        await setDoc(userRef, {
          email: user.email,
          organizationId: organizationId,
          createdAt: new Date(),
        });

        const memberRef = doc(
          db,
          `organizations/${organizationId}/members/${user.uid}`
        );
        await setDoc(memberRef, { role: "user", merge: true });

        router.push("/onboarding");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-xs">
      <form onSubmit={handleLogin} className="flex flex-col gap-8">
        <h1>Logg inn</h1>

        <div className="gap-4 flex flex-col">
          <input
            label="E-mail"
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button disabled={loading} className="darkButton" type="submit">
          Logg inn
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
