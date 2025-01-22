"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

function AuthenticatedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="antialiased w-full h-full bg-slate-100">
        <AuthProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
