"use client";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import Loading from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import ClientCard from "./ClientCard";
import { useState, useEffect, useMemo } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ClientList = () => {
  const { user, organizationId, loading } = useAuth();
  const { data: clients, error } = useFirestoreCollection(db, "clients", [
    "organizationId",
    "==",
    organizationId,
  ]);

  const STAGES = useMemo(
    () => [
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
    ],
    []
  );

  const [stages, setStages] = useState({});

  useEffect(() => {
    if (clients) {
      const newStages = STAGES.reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
      }, {});

      clients.forEach((client) => {
        const stage = client.followUpStage || "Not set";
        if (newStages[stage]) {
          newStages[stage].push(client);
        }
      });

      setStages(newStages);
    }
  }, [clients, STAGES]);

  const updateFollowUpStage = async (clientId, newStage) => {
    const clientRef = doc(db, "clients", clientId);
    await updateDoc(clientRef, { followUpStage: newStage });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const clientId = draggableId;
    const newStage = destination.droppableId;

    await updateFollowUpStage(clientId, newStage);

    setStages((prevStages) => {
      const updatedStages = { ...prevStages };

      updatedStages[source.droppableId] = updatedStages[
        source.droppableId
      ].filter((client) => client.id !== clientId);

      const movedClient = clients.find((client) => client.id === clientId);

      if (movedClient) {
        updatedStages[newStage].push({
          ...movedClient,
          followUpStage: newStage,
        });
      }

      return updatedStages;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="flex gap-4 overflow-auto">
        {Object.entries(stages).map(([stage, clients]) => (
          <Droppable key={stage} droppableId={stage}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col min-w-[20rem]"
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
