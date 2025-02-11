import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { user, to, subject, message, threadId, inReplyTo } =
      await req.json();

    if (!user)
      return Response.json({ error: "Ingen bruker mottat" }, { status: 400 });

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists() || !userDoc.data().mailTokens.gmail)
      return Response.json(
        { error: "Ingen Gmail-tilkobling funnet" },
        { status: 400 }
      );

    const { access_token } = userDoc.data().mailTokens.gmail;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    if (!to) {
      return Response.json(
        { error: "Alle feltene må fylles ut" },
        { status: 400 }
      );
    }

    const gmail = google.gmail({ version: "v1", auth });

    const email = [
      `To: ${to}`,
      "Content-Type: text/html; charset=UTF-8",
      `Subject: ${subject}`,
      inReplyTo ? `In-Reply-To: ${inReplyTo}` : "",
      threadId ? `References ${threadId}` : "",
      "",
      message,
    ].join("\n");

    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedEmail },
    });

    return Response.json({ message: "E-post sendt!", result });
  } catch (error) {
    console.error("Feil ved sending av e-post:", error);
    return Response.json(
      { error: "Kunne ikke sende e-post." },
      { status: 500 }
    );
  }
}
