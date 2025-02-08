import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("userId");

    if (!user)
      return Response.json({ error: "Ingen bruker mottatt" }, { status: 400 });

    const userRef = doc(db, "users", user);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists() || !userDoc.data().gmailTokens)
      return Response.json(
        { error: "Ingen Gmail-tilkobling funnet" },
        { status: 400 }
      );

    const { access_token } = userDoc.data().gmailTokens;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        return {
          id: email.data.id,
          snippet: email.data.snippet,
          payload: email.data.payload,
        };
      })
    );

    return Response.json({ emails });
  } catch (error) {
    console.error("Feil ved henting av e-poster:", error);
    return Response.json(
      { error: "Feil ved henting av e-poster" },
      { status: 500 }
    );
  }
}
