"use client";
import ConnectGmail from "@/components/functionalButtons/ConnectGmail";
import ConnectOutlook from "@/components/functionalButtons/ConnectOutlook";
import Loading from "@/components/Loading";
import UpdateProfile from "@/components/UpdateProfile";
import { useAuth } from "@/context/AuthContext";
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const provider = searchParams.get("state");
  const { user, loading } = useAuth();
  const { provider: currentProvider, loading: providerLoading } =
    useGetMailProvider(user?.uid);

  useEffect(() => {
    const exchangeCode = async () => {
      if (!code || !user | !provider) return;

      try {
        const response = await fetch(`/api/${provider}/${provider}Auth`, {
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
  }, [code, provider, user, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="defaultContainer">
      <UpdateProfile route={""} />
      <ConnectGmail />
      <ConnectOutlook />
      <p>{currentProvider}</p>
    </main>
  );
}
