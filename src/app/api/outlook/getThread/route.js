import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const conversationId = searchParams.get("conversationId");

    if (!userId || !conversationId) {
      return Response.json(
        { error: "Ingen bruker eller tråd-ID mottatt" },
        { status: 400 }
      );
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

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages?$filter=conversationId eq '${conversationId}'`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await response.json();

    if (data.value && data.value.length > 0) {
      return Response.json({ mails: data.value });
    } else {
      return Response.json({ mails: [] });
    }
  } catch (error) {
    console.error("Feil ved henting av e-poster:", error);
    return Response.json(
      { error: "Feil ved henting av e-poster" },
      { status: 500 }
    );
  }
}
