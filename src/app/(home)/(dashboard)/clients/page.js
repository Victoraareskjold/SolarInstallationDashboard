import ClientList from "@/components/ClientList";
import Link from "next/link";

export default function ClientsPage() {
  return (
    <main className="p-2 flex flex-col gap-4">
      <div>
        <h1>Your clients</h1>
        <Link href="/clients/create">Create new client</Link>
      </div>
      <ClientList />
    </main>
  );
}
