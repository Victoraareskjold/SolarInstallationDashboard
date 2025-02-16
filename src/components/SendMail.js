"use client";
import { useAuth } from "@/context/AuthContext";
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function SendMail({ clientId, clientData }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    to: clientData?.email || "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const router = useRouter();

  const { provider: currentProvider, loading: providerLoading } =
    useGetMailProvider(user?.uid);

  useEffect(() => {
    if (clientData?.email && formData.to !== clientData?.email) {
      setFormData((prevData) => ({
        ...prevData,
        to: clientData?.email,
      }));
    }
  }, [clientData, formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setStatus("Sender e-post...");

    try {
      const response = await fetch(
        `/api/${currentProvider}/sendMail?userId=${user.uid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userId: user.uid }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatus("E-post sendt!");
        alert("Email sent!");
      } else {
        setStatus(`Feil: ${data.error}`);
      }
    } catch (error) {
      setStatus("Kunne ikke sende e-post.");
    }
  };

  if (!clientData) {
    return <Loading />;
  }

  return (
    <main className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="to"
          placeholder="To (e-mail)"
          value={formData.to}
          onChange={handleChange}
          required
          hidden
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="subject"
          placeholder="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          hidden
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-32"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Send e-mail
        </button>
      </form>
      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </main>
  );
}
