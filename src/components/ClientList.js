"use client";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import Loading from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import ClientCard from "./ClientCard";
import { useState, useEffect, useMemo } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const STAGES = [
  "Not set",
  "Oppfølging 1 [Prisestimat Sendt]",
  "Oppfølging 2",
  "Oppfølging 3",
  "Oppfølging 4",
  "Oppfølging 5",
  "FEILKORRIGERINGSOMRÅDE",
  "Tilleggsinformasjon Nødvendig",
  "Dialog 1 [Dialog Start]",
  "Nærings kunder [Dialog start]",
  "Befaringsprosess",
  "Dialog 2 [Tilbud Sendt]",
  "Dialog 3 [Signering Etterspurt]",
  "Salg Fullført & Avtale Signert",
  "Anlegg Ferdigmontert",
  "Ikke interessert",
  "Nyhetsbrev (Langsiktig Nurturing)",
];

const ClientList = () => {
  const { user, organizationId, loading } = useAuth();
  const { data: clients, error } = useFirestoreCollection(db, "clients", [
    "organizationId",
    "==",
    organizationId,
  ]);

  const [stages, setStages] = useState({});

  useEffect(() => {
    if (!clients) return;

    const initialStages = STAGES.reduce((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {});

    clients.forEach((client) => {
      const stage = client.followUpStage || "Not set";
      initialStages[stage].push(client);
    });

    setStages((prevStages) => {
      if (JSON.stringify(prevStages) === JSON.stringify(initialStages)) {
        return prevStages;
      }
      return initialStages;
    });
  }, [clients]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const clientId = draggableId;
    const newStage = destination.droppableId;
    const prevStage = source.droppableId;

    if (newStage === prevStage) return;

    setStages((prevStages) => {
      const updatedStages = { ...prevStages };

      updatedStages[prevStage] = updatedStages[prevStage].filter(
        (client) => client.id !== clientId
      );

      const movedClient = prevStages[prevStage].find(
        (client) => client.id === clientId
      );

      if (movedClient) {
        updatedStages[newStage] = [
          ...updatedStages[newStage],
          { ...movedClient, followUpStage: newStage },
        ];
      }

      return updatedStages;
    });

    await updateDoc(doc(db, "clients", clientId), {
      followUpStage: newStage,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="flex overflow-auto min-h-96">
        {Object.entries(stages).map(([stage, clients]) => (
          <Droppable key={stage} droppableId={stage}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col min-w-[20rem] px-2"
                style={{ borderRight: "1px solid #ccc" }}
              >
                <h2 className="text-lg font-bold mb-2 w-fit">{stage}</h2>

                <ul className="flex flex-col gap-2 p-1">
                  {clients.length > 0 ? (
                    clients.map((client, index) => (
                      <Draggable
                        key={client.id}
                        draggableId={client.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ClientCard client={client} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-gray-500">Empty</p>
                  )}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        ))}
      </section>
    </DragDropContext>
  );
};

export default ClientList;
