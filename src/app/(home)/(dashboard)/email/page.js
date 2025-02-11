"use client";
import { useAuth } from "@/context/AuthContext";
import useMails from "@/hooks/useMails";
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import Link from "next/link";
import OutlookInboxView from "@/components/outlook/OutlookInboxView";
import GmailInboxView from "@/components/gmail/GmailInboxView";

export default function EmailPage() {
  const { user } = useAuth();

  const { provider: currentProvider, loading: providerLoading } =
    useGetMailProvider(user?.uid);

  const { mails, loading, error } = useMails(user?.uid, currentProvider);

  if (providerLoading || loading) return <p>Laster inn e-poster...</p>;
  if (error) return <p>Feil: {error}</p>;
  if (!currentProvider) return <p>Ingen e-postleverandør funnet.</p>;

  return (
    <main className="p-2 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">
          📩 Innboks for {currentProvider}
        </h1>
        <Link href="/email/send" className="darkButton ">
          Send email
        </Link>
      </div>

      <section className="">
        {currentProvider == "outlook" && <OutlookInboxView mails={mails} />}
        {currentProvider == "gmail" && <GmailInboxView mails={mails} />}
        {currentProvider == null && (
          <p>Please setup a mail provider in your profile</p>
        )}
      </section>
    </main>
  );
}
