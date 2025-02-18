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
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import useMails from "@/hooks/useMails";
import { useAuth } from "@/context/AuthContext";

export default function ClientView() {
  const { clientId } = useParams();
  const { user } = useAuth();
  const { data: clientData, error } = useFirestoreDoc(db, "clients", clientId);
  const [isReply, setIsReply] = useState(null);
  const hasRoofData = clientData ? true : false;

  const { provider: currentProvider, loading: providerLoading } =
    useGetMailProvider(user?.uid);

  const {
    mails: mailData,
    loading: mailLoading,
    error: mailError,
  } = useMails(user?.uid, currentProvider);

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

  if (mailLoading) return <p>Laster e-post...</p>;
  if (mailError) return <p>Feil: {mailError}</p>;
  if (!mailData.length) return <p>Ingen e-poster funnet.</p>;

  const filteredMails = mailData.filter(
    (mail) =>
      mail.toRecipients.some(
        (to) => to.emailAddress.address === clientData?.email
      ) || mail.from?.emailAddress?.address === clientData?.email
  );

  const lastMailId = filteredMails[0].id;

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

      <MailThread
        clientId={clientId}
        clientData={clientData}
        filteredMails={filteredMails}
      />
      <SendMail
        clientId={clientId}
        clientData={clientData}
        isReply={isReply}
        lastMailId={lastMailId}
      />
    </main>
  );
}
