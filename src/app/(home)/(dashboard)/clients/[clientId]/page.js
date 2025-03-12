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
import PriorityDropdown from "@/components/calculator/client/PriorityDropdown";

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

  if (mailError) return <p>Feil: {mailError}</p>;

  console.log(mailData);

  const normalizeEmail = (email) => {
    if (typeof email !== "string") return null;
    return email.replace(/\./g, "");
  };

  const filteredMails = mailData.filter(
    (mail) =>
      mail.toRecipients.some(
        (to) =>
          normalizeEmail(to.emailAddress.address) ==
          normalizeEmail(clientData?.email)
      ) ||
      normalizeEmail(mail.from?.emailAddress?.address) ==
        normalizeEmail(clientData?.email)
  );

  const lastMailId = filteredMails[0]?.id || null;

  return (
    <main className="defaultContainer">
      <BackButton />
      <section className="flex flex-row justify-between items-center">
        <div>
          <p>
            <strong>{clientData?.name}</strong>
          </p>
          <p>Addresse: {clientData?.address || "No address set"}</p>
          <p>E-post: {clientData?.email || "No email set"}</p>
          <p>Telefon: {clientData?.phone || "No phone number set"}</p>
          <PriorityDropdown clientId={clientId} clientData={clientData} />
        </div>
        <Link
          className="darkButton"
          href={`/clients/create?clientId=${clientId}`}
        >
          {hasRoofData ? "View Estimate" : "Create Estimate"}
        </Link>
      </section>

      {currentProvider ? (
        <section>
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
        </section>
      ) : (
        <p className="text-center text-red-500 font-regular text-md mt-12">
          Please configure your mail provider.
        </p>
      )}
    </main>
  );
}
