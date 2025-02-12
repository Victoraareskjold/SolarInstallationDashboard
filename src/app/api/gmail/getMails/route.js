import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return Response.json({ error: "Ingen bruker mottatt" }, { status: 400 });

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().mailTokens?.gmail)
      return Response.json(
        { error: "Ingen Gmail-tilkobling funnet" },
        { status: 400 }
      );

    const { access_token } = userDoc.data().mailTokens.gmail;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 25,
    });

    const messages = response.data.messages || [];

    const mails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        const headers = email.data.payload.headers;
        const subjectHeader = headers.find(
          (header) => header.name === "Subject"
        );
        const subject = subjectHeader ? subjectHeader.value : "Ingen emne";

        return {
          id: email.data.id,
          snippet: email.data.snippet,
          payload: email.data.payload,
        };
      })
    );
    return Response.json({ mails });
  } catch (error) {
    console.error("Feil ved henting av e-poster:", error);
    return Response.json(
      { error: "Feil ved henting av e-poster" },
      { status: 500 }
    );
  }
}
