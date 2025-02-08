"use client";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import "../globals.css";

function AuthenticatedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-100">
        <AuthProvider>
          <AuthenticatedLayout>
            <div>
              <Suspense>{children}</Suspense>
            </div>
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
