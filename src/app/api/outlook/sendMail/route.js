import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";

export async function POST(req) {
  try {
    const { userId, to, subject, message, isReply, lastMailId } =
      await req.json();

    if (!userId || !to || !subject || !message) {
      return Response.json({ error: "Manglende data" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().mailTokens?.outlook) {
      return Response.json(
        { error: "Ingen Outlook-tilkobling funnet" },
        { status: 400 }
      );
    }

    const { access_token } = userDoc.data().mailTokens.outlook;

    let sendEmailResponse;

    if (isReply) {
      console.log("replying");
      sendEmailResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages/${lastMailId}/replyAll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: message,
          }),
        }
      );
    } else {
      console.log("Starting thread");
      sendEmailResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/sendMail",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              subject: subject,
              body: { contentType: "HTML", content: message },
              toRecipients: [{ emailAddress: { address: to } }],
            },
          }),
        }
      );
    }

    if (!sendEmailResponse.ok) {
      throw new Error("Kunne ikke sende e-post via Outlook");
    }

    const threadId = `${userId}-${to}`;

    const emailRef = doc(collection(db, "emails"), threadId);
    await setDoc(emailRef, {
      threadId,
      userId,
      provider: "outlook",
      to,
      timestamp: Date.now(),
    });

    return Response.json({ success: true, threadId });
  } catch (error) {
    console.error("Feil ved sending av e-post:", error);
    return Response.json(
      { error: "Feil ved sending av e-post" },
      { status: 500 }
    );
  }
}
