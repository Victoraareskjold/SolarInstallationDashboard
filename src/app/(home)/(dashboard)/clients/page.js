import ClientList from "@/components/ClientList";
import Link from "next/link";

export default function ClientsPage() {
  return (
    <main className="defaultContainer">
      <div className="flex flex-row justify-between">
        <h1>Your clients</h1>
        <Link className="darkButton" href="/clients/create">
          Create new client
        </Link>
      </div>
      <ClientList />
    </main>
  );
}
