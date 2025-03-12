import Link from "next/link";

export default function ClientCard({ client }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    return timestamp.toDate().toLocaleString();
  };

  const priorityColor = (priority) => {
    if (priority === "Iron") return "bg-slate-200 text-slate-800";
    if (priority === "Gold") return "bg-yellow-100 text-yellow-800";
    if (priority === "Diamond") return "bg-blue-200 text-blue-900";
    return "bg-slate-100"; // Standardfarge
  };

  return (
    <Link
      href={`/clients/${client.id}`}
      className="block bg-white p-2 w-full rounded-md shadow-md hover:opacity-70 duration-200"
    >
      <h2>
        <strong>{client?.name}</strong>
      </h2>
      <p>{client?.address || "Missing address"}</p>
      <p
        className={`${priorityColor(
          client?.priority
        )} rounded-md font-semibold w-fit py-1 px-2 mt-4`}
      >
        {client?.priority || "No priority set"}
      </p>
    </Link>
  );
}
