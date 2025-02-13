"use client";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import Loading from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

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

  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    return timestamp.toDate().toLocaleString();
  };

  return (
    <section>
      {clients.length > 0 ? (
        <ul className="flex flex-col">
          {clients.map((client) => (
            <li key={client.id} className="mt-4">
              <h2>Address: {client.address}</h2>
              <p>Creator: {client.creator}</p>
              <p>Created at: {formatDate(client.createdAt)}</p>
              {/* {client.imageUrl ? (
                <Image
                  src={client.imageUrl}
                  alt="image"
                  height={120}
                  width={120}
                />
              ) : null} */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingen estimater funnet for denne organisasjonen.</p>
      )}
    </section>
  );
}
