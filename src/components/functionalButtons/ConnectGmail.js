"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ConnectGmail() {
  const router = useRouter();
  const { user } = useAuth();

  const connectGmail = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    const scope =
      "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&access_type=offline&prompt=consent&state=gmail`;

    router.push(authUrl);
  };

  return (
    <button
      onClick={connectGmail}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Koble til Gmail
    </button>
  );
}
