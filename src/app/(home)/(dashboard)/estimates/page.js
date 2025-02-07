"use client";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import Loading from "@/components/Loading";
import Link from "next/link";
import EstimateCard from "@/components/EstimateCard";

export default function Estimates() {
  const { user, organizationId, loading } = useAuth();

  const { data: estimates, error } = useFirestoreCollection(db, "estimates", [
    "organizationId",
    "==",
    organizationId,
  ]);

  if (loading) {
    return <Loading />;
  }

  const formatDate = (timestamp) => {
    return timestamp.toDate().toLocaleString();
  };

  return (
    <main className="h-full w-full">
      <h1>Estimater for {}</h1>
      <p>{organizationId.organization}</p>
      <div className="mb-12">
        {estimates.length > 0 ? (
          <ul className="flex flex-col">
            {estimates.map((estimate) => (
              <li key={estimate.id}>
                <h2>Address: {estimate.address}</h2>
                <p>Creator: {estimate.creator}</p>
                <p>Created at: {formatDate(estimate.createdAt)}</p>
                <EstimateCard />
              </li>
            ))}
          </ul>
        ) : (
          <p>Ingen estimater funnet for denne organisasjonen.</p>
        )}
      </div>
      <Link className="darkButton" href="/estimates/create">
        Opprett nytt estimat
      </Link>
      {error}
    </main>
  );
}
