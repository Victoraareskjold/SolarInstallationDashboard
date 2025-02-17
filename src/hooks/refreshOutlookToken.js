import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

async function refreshOutlookToken(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists() || !userDoc.data().mailTokens?.outlook) {
    throw new Error("Ingen Outlook-tilkobling funnet");
  }

  const { refresh_token } = userDoc.data().mailTokens.outlook;

  try {
    const response = await fetch(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_SECRET,
          refresh_token: refresh_token,
          grant_type: "refresh_token",
        }),
      }
    );

    const data = await response.json();

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Kunne ikke fornye token");
    }

    await updateDoc(userRef, {
      "mailTokens.outlook.access_token": data.access_token,
      "mailTokens.outlook.refresh_token": data.refresh_token,
      "mailTokens.outlook.expires_in": Date.now() + data.expires_in * 1000, // Lagre utløpstidspunkt
    });

    return data.access_token;
  } catch (error) {
    console.error("Feil ved fornying av Outlook-token:", error);
    throw new Error("Kunne ikke fornye token");
  }
}

export default refreshOutlookToken;
