"use client";
import ConnectEmail from "@/components/functionalButtons/ConnectGmail";
import Loading from "@/components/Loading";
import UpdateProfile from "@/components/UpdateProfile";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const { user, loading } = useAuth();

  useEffect(() => {
    const exchangeCode = async () => {
      if (!code || !user) return;

      try {
        const response = await fetch("/api/gmailAuth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, userId: user.uid }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Success");
          router.push("/profile");
        } else {
          alert("problem");
        }
      } catch (err) {
        console.error(err);
      }
    };

    exchangeCode();
  }, [code, user, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <UpdateProfile route={""} />
      <ConnectEmail />
    </main>
  );
}
