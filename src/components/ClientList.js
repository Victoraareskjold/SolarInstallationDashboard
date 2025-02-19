"use client";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import Loading from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import ClientCard from "./ClientCard";
import { useState, useEffect } from "react";
import { updateDoc, doc } from "firebase/firestore";

const ClientList = () => {
  const { user, organizationId, loading } = useAuth();
  const { data: clients, error } = useFirestoreCollection(db, "clients", [
    "organizationId",
    "==",
    organizationId,
  ]);

  const [stages, setStages] = useState({
    "Not Set": [],
    "Oppfølging 1": [],
    "Oppfølging 2": [],
    "Oppfølging 3": [],
  });

  useEffect(() => {
    const newStages = {
      "Not Set": [],
      "Oppfølging 1": [],
      "Oppfølging 2": [],
      "Oppfølging 3": [],
    };

    clients.forEach((client) => {
      const stage = client.followUpStage || "Not Set";
      if (newStages[stage]) {
        newStages[stage].push(client);
      }
    });
    setStages(newStages);
  }, [clients]);

  const updateFollowUpStage = async (clientId, newStage) => {
    const clientRef = doc(db, "clients", clientId);
    await updateDoc(clientRef, { followUpStage: newStage });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    const clientId = e.dataTransfer.getData("clientId");
    await updateFollowUpStage(clientId, newStage);

    setStages((prevStages) => {
      const updatedStages = { ...prevStages };

      Object.keys(updatedStages).forEach((stage) => {
        updatedStages[stage] = updatedStages[stage].filter(
          (client) => client.id !== clientId
        );
      });

      const client = clients.find((client) => client.id === clientId);
      updatedStages[newStage].push(client);

      return updatedStages;
    });
  };

  const handleDragStart = (e, clientId) => {
    e.dataTransfer.setData("clientId", clientId);
  };

  return (
    <section className="flex gap-4 overflow-x-auto">
      {Object.entries(stages).map(([stage, clients]) => (
        <div
          key={stage}
          className="flex flex-col min-w-[16rem]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage)}
        >
          <h2 className="text-lg font-bold mb-2">{stage}</h2>

          <ul className="space-y-4 p-1">
            {clients.length > 0 ? (
              clients.map((client) => (
                <div
                  key={client.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, client.id)}
                >
                  <ClientCard client={client} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Empty</p>
            )}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default ClientList;
