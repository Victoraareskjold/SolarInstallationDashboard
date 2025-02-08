import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { code, userId } = await req.json();
    if (!code || !userId)
      return Response.json({ error: "Ingen kode mottatt" }, { status: 400 });

    const auth = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );

    const { tokens } = await auth.getToken(code);
    if (!tokens)
      return Response.json(
        { error: "Kunne ikke hente token" },
        { status: 500 }
      );

    // Lagre i Firestore
    await setDoc(
      doc(db, "users", userId),
      { gmailTokens: tokens },
      { merge: true }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("OAuth feil:", error);
    return Response.json({ error: "OAuth feilet" }, { status: 500 });
  }
}
