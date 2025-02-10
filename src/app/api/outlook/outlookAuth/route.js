import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { code, userId } = await req.json();
    if (!code || !userId)
      return Response.json({ error: "Ingen kode mottatt" }, { status: 400 });

    const tokenUrl =
      "https://login.microsoftonline.com/common/oauth2/v2.0/token";

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.NEXT_PUBLIC_OUTLOOK_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const tokens = await response.json();

    if (!tokens.access_token)
      return Response.json(
        { error: "Kunne ikke hente token" },
        { status: 500 }
      );

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      mailTokens: { outlook: tokens },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Outlook OAuth feil:", error);
    return Response.json({ error: "OAuth feilet" }, { status: 500 });
  }
}
