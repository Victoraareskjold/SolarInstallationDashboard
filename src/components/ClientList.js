"use client";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import Loading from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import ClientCard from "./ClientCard";

export default function ClientList() {
  const { user, organizationId, loading } = useAuth();

  const { data: clients, error } = useFirestoreCollection(db, "clients", [
    "organizationId",
    "==",
    organizationId,
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      {clients.length > 0 ? (
        <ul className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </ul>
      ) : (
        <p>Ingen estimater funnet for denne organisasjonen.</p>
      )}
    </section>
  );
}
