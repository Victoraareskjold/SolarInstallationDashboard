import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Buffer } from "buffer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("userId");
    const threadId = searchParams.get("threadId");

    if (!user) {
      return Response.json({ error: "Ingen bruker mottatt" }, { status: 400 });
    }

    const userRef = doc(db, "users", user);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists() || !userDoc.data().gmailTokens) {
      return Response.json(
        { error: "Ingen Gmail-tilkobling funnet" },
        { status: 400 }
      );
    }

    const { access_token } = userDoc.data().gmailTokens;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
    });

    const messages = response.data.messages || [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        const headers = email.data.payload.headers;
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";

        // Henter og dekoder meldingsinnholdet
        let body = "";
        if (email.data.payload.parts) {
          const part =
            email.data.payload.parts.find((p) => p.mimeType === "text/html") ||
            email.data.payload.parts.find((p) => p.mimeType === "text/plain");

          if (part?.body?.data) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
          }
        } else if (email.data.payload.body?.data) {
          body = Buffer.from(email.data.payload.body.data, "base64").toString(
            "utf-8"
          );
        }

        return {
          id: email.data.id,
          subject,
          from,
          snippet: email.data.snippet,
          body,
        };
      })
    );

    return Response.json({ conversation: emails });
  } catch (error) {
    console.error("Feil ved henting av e-posttråd:", error);
    return Response.json(
      { error: "Feil ved henting av e-posttråd" },
      { status: 500 }
    );
  }
}
