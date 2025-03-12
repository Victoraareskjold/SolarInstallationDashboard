"use client";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PriorityDropdown({ clientId, clientData }) {
  const priority = ["Iron", "Gold", "Diamond"];
  const [selectedPriority, setSelectedPriority] = useState(
    clientData?.priority || ""
  );
  if (!clientId || !clientData) {
    return <p>Laster prioritet...</p>;
  }

  const handleChange = async (event) => {
    const newPriority = event.target.value;
    setSelectedPriority(newPriority);

    try {
      const clientRef = doc(db, "clients", clientId);
      await updateDoc(clientRef, { priority: newPriority });
    } catch (error) {
      console.error("Feil ved oppdatering:", error);
    }
  };

  return (
    <select value={selectedPriority} onChange={handleChange} className="input">
      {priority.map((priority) => (
        <option key={priority} value={priority}>
          {priority}
        </option>
      ))}
    </select>
  );
}
