"use client";
import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import Link from "next/link";
import MailThread from "@/components/MailThread";
import SendMail from "@/components/SendMail";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ClientView() {
  const { clientId } = useParams();
  const { data: clientData, error } = useFirestoreDoc(db, "clients", clientId);

  const hasRoofData = clientData ? true : false;
  const [isReply, setIsReply] = useState(null);

  useEffect(() => {
    if (clientData) {
      const checkReply = async () => {
        const emailsRef = collection(db, "emails");
        const q = query(emailsRef, where("to", "==", clientData.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsReply(true);
        } else {
          setIsReply(false);
        }
      };

      checkReply();
    }
  }, [clientData]);

  if (!clientData) {
    return <Loading />;
  }

  return (
    <main className="defaultContainer">
      <BackButton />

      <section>
        <p>
          <strong>{clientData?.name}</strong>
        </p>
        <p>{clientData?.email}</p>
      </section>

      <Link
        className="darkButton"
        href={`/clients/create?clientId=${clientId}`}
      >
        {hasRoofData ? "View Estimate" : "Create Estimate"}
      </Link>

      <MailThread clientId={clientId} clientData={clientData} />
      <SendMail clientId={clientId} clientData={clientData} isReply={isReply} />
    </main>
  );
}
