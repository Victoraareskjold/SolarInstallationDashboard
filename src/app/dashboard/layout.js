"use client";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full h-full">
      <Navbar />
      {children}
    </div>
  );
}
