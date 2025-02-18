"use client";
import { useAuth } from "@/context/AuthContext";
import { useGetMailProvider } from "@/hooks/useGetMailProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function SendMail({
  clientId,
  clientData,
  isReply,
  lastMailId,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    to: clientData?.email || "",
    subject: clientId || "",
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

  const [selectedTemplate, setSelectedTemplate] = useState("");

  const templates = [
    { id: 1, name: "Påminnelse", content: "Hei, husk avtalen vår..." },
    {
      id: 2,
      name: "Takk for forespørsel",
      content: "Takk for din forespørsel!",
    },
    {
      id: 3,
      name: "Send estimat",
      content: `Vi har et tilbud for deg... Sjek denne linken: <a href="https://www.lynelektrosol.no/estimat/${clientId}">Se estimat<a/>`,
    },
  ];

  const handleTemplateSelect = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      message: content,
    }));
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
          body: JSON.stringify({
            ...formData,
            userId: user.uid,
            isReply,
            lastMailId,
          }),
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
        <div className="mt-4">
          <p className="font-bold">Velg en mal:</p>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => handleTemplateSelect(e.target.value)}
          >
            <option value="">Velg en mal...</option>
            {templates.map((template) => (
              <option key={template.id} value={template.content}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          {isReply ? "Reply" : "Send"}
        </button>
      </form>
      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </main>
  );
}
