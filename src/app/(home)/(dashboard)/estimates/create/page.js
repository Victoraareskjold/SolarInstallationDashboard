"use client";
import { useAuth } from "@/context/AuthContext";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { useCreateFirestoreDoc } from "@/hooks/useCreateFirestoreDoc";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

export default function CreateEstimate() {
  const { user, organizationId } = useAuth();

  const {
    createDoc,
    error: estimateError,
    loading: estimateLoading,
    success: estimateSuccess,
  } = useCreateFirestoreDoc(db, "estimates");
  const { data: userData, loading: userLoading } = useFirestoreDoc(
    db,
    "users",
    user?.uid
  );

  const [address, setAddress] = useState("");

  const handleCreateEstimate = async (e) => {
    e.preventDefault();

    const estimateData = {
      organizationId: organizationId,
      address: address,
      creator: `${userData?.firstName} ${userData?.lastName}`,
      createdAt: new Date(),
    };

    try {
      await createDoc(estimateData);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <main className="h-full w-full">
      <form
        onSubmit={handleCreateEstimate}
        className="flex flex-col gap-8 max-w-md"
      >
        <div className="gap-4 flex flex-col">
          <input
            className="input"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            className="darkButton"
            disabled={estimateLoading || userLoading}
            type="submit"
          >
            Create estimate
          </button>
        </div>
      </form>
      {estimateError && <p style={{ color: "red" }}>{estimateError}</p>}
      {estimateSuccess && <p style={{ color: "green" }}>Estimat opprettet!</p>}
    </main>
  );
}
