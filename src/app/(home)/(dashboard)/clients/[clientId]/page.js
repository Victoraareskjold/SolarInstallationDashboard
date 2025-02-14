"use client";
import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import Image from "next/image";
import Link from "next/link";

export default function ClientView() {
  const { clientId } = useParams();

  const { data: clientData, error } = useFirestoreDoc(db, "clients", clientId);

  return (
    <main className="defaultContainer">
      <BackButton />
      {/* {JSON.stringify(clientData?.roofData, null, 2)} */}
      {clientData ? (
        <section>
          <p>{clientData?.email}</p>
          <Link href={`/clients/create?clientId=${clientId}`}>Vis estimat</Link>
          {/* {clientData?.roofData.map((roof, index) => (
            <div key={index} className="mb-2 flex flex-row gap-2">
              <p>Tak ID: {roof.roofId}</p>
              <p>adjustedPanelCount: {roof.adjustedPanelCount}</p>
              <p>maxPanels: {roof.maxPanels}</p>
              <p>angle: {roof.angle.toFixed(0)}</p>
              <p>direction: {roof.direction}</p>
            </div>
          ))}
          {clientData?.imageUrl && (
            <div className="relative w-24 h-24">
              <Image
                src={clientData?.imageUrl}
                fill
                alt="Bilde"
                className="object-contain rounded-lg shadow-md"
              />
            </div>
          )} */}
        </section>
      ) : (
        <p>No client data found.</p>
      )}
    </main>
  );
}
