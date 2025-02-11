import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("userId");

    if (!user)
      return Response.json({ error: "Ingen bruker mottatt" }, { status: 400 });

    const userRef = doc(db, "users", user);
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

    const response = await gmail.users.threads.list({
      userId: "me",
      maxResults: 25,
    });

    const threads = response.data.threads || [];

    const emails = await Promise.all(
      threads.map(async (thread) => {
        const threadData = await gmail.users.threads.get({
          userId: "me",
          id: thread.id,
        });

        const lastMessage = threadData.data.messages.pop();

        return {
          id: lastMessage.id,
          threadId: thread.id,
          snippet: lastMessage.snippet,
          payload: lastMessage.payload,
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
