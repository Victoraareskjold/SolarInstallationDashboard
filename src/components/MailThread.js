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

  const cleanMailBody = (body, isSenderYou) => {
    // Hvis det er en melding som er et svar og ikke originalt (fra deg)
    if (!isSenderYou) {
      return body
        .replace(/>.*$/gs, "") // Fjerner alt etter første forekomst av >
        .trim();
    }
    // Hvis det er fra deg, beholder vi alt
    return body;
  };

  const formatDate = (date) => {
    if (date) {
      const newDate = new Date(date);
      return newDate.toLocaleDateString("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return null;
  };

  console.log(filteredMails);

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
              style={{
                backgroundColor: isSenderYou ? "lightgrey" : "lightblue",
              }}
              key={mail.id}
              className="border p-4 rounded shadow mb-4"
            >
              <h3>
                <strong>{isSenderYou ? "You" : clientData.name}</strong>
                {isSenderYou ? null : ` - ${clientData.email}`}
              </h3>

              <p></p>
              <div
                dangerouslySetInnerHTML={{
                  __html: cleanMailBody(mail.body.content, isSenderYou),
                }}
              />
              <p className="text-gray-600 text-sm">
                {formatDate(mail.sentDateTime) || "No time"}
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
