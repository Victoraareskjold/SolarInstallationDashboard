"use client";
import LoginNavbar from "@/components/LoginNavbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const { user, loading } = useAuth;
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <html lang="en" className="h-full w-full">
      <body className="antialiased w-full h-full bg-slate-100">
        <AuthProvider>
          <LoginNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
