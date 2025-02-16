"use client";
import { useAuth } from "@/context/AuthContext";
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import useMails from "@/hooks/useMails";

export default function MailThread({ clientData }) {
  const { user } = useAuth();

  const { provider: currentProvider, loading: providerLoading } =
    useGetMailProvider(user?.uid);

  const {
    mails: mailData,
    loading: mailLoading,
    error: mailError,
  } = useMails(user?.uid, currentProvider);

  if (mailLoading) return <p>Laster e-post...</p>;
  if (mailError) return <p>Feil: {mailError}</p>;
  if (!mailData.length) return <p>Ingen e-poster funnet.</p>;

  const filteredMails = mailData.filter(
    (mail) =>
      mail.toRecipients.some(
        (to) => to.emailAddress.address === clientData?.email
      ) || mail.from?.emailAddress?.address === clientData?.email
  );

  return (
    <section>
      <h2 className="text-xl font-bold mb-4"></h2>
      {filteredMails.length > 0 ? (
        filteredMails.map((mail) => {
          const isSenderYou =
            mail.from?.emailAddress?.address == "victor.aareskjold@outlook.com"
              ? true
              : false;
          return (
            <div
              style={{ backgroundColor: isSenderYou ? "green" : "red" }}
              key={mail.id}
              className="border p-4 rounded shadow mb-4"
            >
              <h3 className="text-lg font-bold">
                {mail.subject || "Ingen emne"}
              </h3>
              <p>
                <strong>Fra:</strong>{" "}
                {mail.from?.emailAddress?.address || "Ukjent"}
              </p>
              <p>
                <strong>Til:</strong>{" "}
                {mail.toRecipients
                  .map((to) => to.emailAddress.address)
                  .join(", ") || "Ingen mottakere"}
              </p>
              <p>
                {mail.bodyPreview || "(Ingen forhåndsvisning tilgjengelig)"}
              </p>
            </div>
          );
        })
      ) : (
        <p>Ingen e-poster relatert til denne klienten.</p>
      )}
    </section>
  );
}
