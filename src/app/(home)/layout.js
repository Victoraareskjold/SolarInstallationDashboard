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
      <main className="flex-row flex h-full">
        {user && <Navbar />}
        {children}
      </main>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased bg-slate-100 h-full">
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
