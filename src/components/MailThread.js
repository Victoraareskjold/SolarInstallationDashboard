export default function MailThread({ clientData, filteredMails }) {
  const cleanMailBody = (body) => {
    // Fjern HTML-tagger, men behold linjeskift
    let cleanText = body
      .replace(/<br\s*\/?>/gi, "\n") // Bytt ut <br> med newline
      .replace(/<[^>]+>/g, ""); // Fjern alle HTML-tagger

    // Fjern metadata-linjer ("From:", "Sent:", "To:", "Subject:")
    cleanText = cleanText.replace(/^(From|Sent|To|Subject):.*$/gm, "").trim();

    // Fjern alt etter første "On [date], [sender] wrote:"
    cleanText = cleanText.replace(/On .*? wrote:([\s\S]*)/i, "").trim();

    // Fjern alt etter første <hr> eller lignende separatorer
    cleanText = cleanText.split(/-{2,}|\n?_{2,}\n?/)[0];

    // Fjern tomme linjer og overflødig mellomrom
    cleanText = cleanText.replace(/\n{2,}/g, "\n").trim();

    return cleanText;
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
