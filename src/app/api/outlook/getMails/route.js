import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import refreshOutlookToken from "@/hooks/refreshOutlookToken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Ingen bruker mottatt" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().mailTokens?.outlook) {
      return Response.json(
        { error: "Ingen Outlook-tilkobling funnet" },
        { status: 400 }
      );
    }

    let { access_token, expires_in } = userDoc.data().mailTokens.outlook;

    if (!expires_in || Date.now() >= expires_in) {
      console.log("Token utløpt, fornyer...");
      access_token = await refreshOutlookToken(userId);
    }

    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/messages",
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
