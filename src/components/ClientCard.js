import Link from "next/link";

export default function ClientCard({ client }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    return timestamp.toDate().toLocaleString();
  };

  return (
    <Link
      href={`/clients/${client.id}`}
      className="mt-4 bg-white p-2 w-full rounded-md shadow-md"
    >
      <h2>
        <strong>{client?.name}</strong>
      </h2>
    </Link>
  );
}
