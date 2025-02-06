"use client";

import { useAuth } from "@/context/AuthContext";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function UpdateProfile({ route }) {
  const { user } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: userData,
    error,
    loading,
    setLoading,
    updateDocData,
  } = useFirestoreDoc(db, "users", user?.uid);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (userData) {
      setFirstName(userData?.firstName || "");
      setLastName(userData?.lastName || "");
      setEmail(userData?.email || "");
      setPhone(userData?.phone || "");
    }
  }, [userData]);

  const handleUpdateProfile = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (
      email.trim() == "" ||
      firstName.trim() == "" ||
      lastName.trim() == "" ||
      phone.trim() == ""
    ) {
      setErrorMessage("Please fill all required fields");
      setLoading(false);
      return;
    }

    const newData = { firstName, lastName, email, phone };

    try {
      await updateDocData(newData);
      alert("Profile updated!");
      router.push(route);
    } catch (err) {
      console.error(error);
    }

    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-xs">
      <form onSubmit={handleUpdateProfile} className="flex flex-col gap-8">
        <div className="gap-4 flex flex-col">
          <input
            label="First Name"
            className="input"
            type="name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            label="Last Name"
            className="input"
            type="name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            label="E-mail"
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            label="Phone"
            className="input"
            type="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button
          type="submit"
          onClick={handleUpdateProfile}
          className="darkButton"
          disabled={loading}
        >
          Update profile
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
