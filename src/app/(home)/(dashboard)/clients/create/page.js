"use client";

import { useCreateFirestoreDoc } from "@/hooks/useCreateFirestoreDoc";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ImageUploadComponent from "@/components/ImageUploadComponent";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useUpdateFirestoreDoc } from "@/hooks/useUpdateFirestoreDoc";
import { doc, getDoc } from "firebase/firestore";

export default function CreateClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const { user, organizationId } = useAuth();
  const [solarData, setSolarData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "PVMAP_DATA") {
        setSolarData(event.data.payload);
        console.log(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (clientId) {
      console.log(clientId);
      const fetchClientData = async () => {
        const clientRef = doc(db, "clients", clientId);
        const clientSnap = await getDoc(clientRef);

        if (clientSnap.exists()) {
          const client = clientSnap.data();
          setSolarData(client);
          setImageUrl(client.imageUrl || null);
        }
      };

      fetchClientData();
    }
  }, [clientId]);

  const { data: clientData, error: clientError } = useFirestoreDoc(
    db,
    "clients",
    clientId
  );

  const {
    createDoc,
    error,
    loading: clientLoading,
    success: clientSuccess,
  } = useCreateFirestoreDoc(db, "clients");

  const {
    updateDocData,
    error: updateError,
    loading: updateLoading,
    success: updateSuccess,
  } = useUpdateFirestoreDoc(db, "clients");

  const handleCreateClient = async (e) => {
    e.preventDefault();

    const clientDataToSave = {
      imageUrl: imageUrl || null,
      organizationId: organizationId || null,
      creator: user.uid,
      createdAt: clientId ? clientData?.createdAt : new Date(),
      name: solarData?.name || null,
      email: solarData?.email || null,
      phone: solarData?.phone || null,
      address: solarData?.address || null,
      totalPanels: solarData?.totalPanels || null,
      selectedPanelType: solarData?.selectedPanelType || null,
      selectedRoofType: solarData?.selectedRoofType || null,
      roofData: solarData?.checkedRoofData || null,
      selectedElPrice: solarData?.selectedElPrice || null,
      yearlyCost: solarData?.yearlyCost || null,
      yearlyCost2: solarData?.yearlyCost2 || null,
      yearlyProd: solarData?.yearlyProd || null,
      desiredKWh: solarData?.desiredKWh || null,
      coveragePercentage: solarData?.coveragePercentage || null,
    };

    try {
      if (clientId) {
        await updateDocData(clientId, clientDataToSave);
      } else {
        await createDoc(clientDataToSave);
      }
      if (!error || !updateError) {
        router.push("/clients");
      } else {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <main className="p-2 flex flex-col gap-4 w-full">
        <div>
          <h1>Create new client</h1>
        </div>
        <BackButton />
        <button onClick={handleToggleModal}>
          {isModalOpen ? "Close modal" : "Open modal"}
        </button>
        <section className="relative flex flex-col">
          <ImageUploadComponent setImageUrl={setImageUrl} />
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Bilde"
              fill
              className="object-contain rounded-lg shadow-md"
            />
          ) : null}
        </section>
        <form
          onSubmit={handleCreateClient}
          className="flex flex-col gap-3 w-full"
        >
          <label>Fullt navn</label>

          <input
            value={solarData?.name || ""}
            onChange={(e) =>
              setSolarData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Navn"
            className="border p-2 w-full"
          />

          <label>E-post</label>
          <input
            value={solarData?.email || ""}
            onChange={(e) =>
              setSolarData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="E-post"
            className="border p-2"
          />

          <label>Telefon</label>
          <input
            value={solarData?.phone || ""}
            onChange={(e) =>
              setSolarData((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
            placeholder="Telefon"
            className="border p-2"
          />

          <label>Adresse</label>
          <input
            value={solarData?.address || ""}
            readOnly
            disabled
            placeholder="Adresse"
            className="border p-2"
          />

          {solarData?.checkedRoofData?.length > 0 && (
            <div className="flex flex-col gap-3 w-full">
              <h2 className="font-bold mb-2">Takflater</h2>
              {solarData.checkedRoofData.map((roof, index) => (
                <div key={index} className="p-4 mb-2 w-full">
                  <p>Tak ID: {roof.roofId}</p>
                  <div className="flex flex-row justify-between gap-2 w-full">
                    <div className="w-full">
                      <label>Paneler</label>
                      <input
                        value={roof.adjustedPanelCount}
                        readOnly
                        disabled
                        className="border p-2 w-full"
                      />
                    </div>

                    <div className="w-full">
                      <label>Maks paneler</label>
                      <input
                        value={roof.maxPanels}
                        readOnly
                        disabled
                        className="border p-2 w-full"
                      />
                    </div>

                    <div className="w-full">
                      <label>Retning</label>
                      <input
                        value={roof.direction}
                        readOnly
                        disabled
                        className="border p-2 w-full"
                      />
                    </div>

                    <div className="w-full">
                      <label>Vinkel</label>
                      <input
                        value={roof.angle.toFixed(0)}
                        readOnly
                        disabled
                        className="border p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label>Årlig produksjon (kWh)</label>
          <input
            value={solarData?.yearlyProd || ""}
            readOnly
            disabled
            placeholder="Årlig produksjon"
            className="border p-2"
          />

          <label>Strømpris (kr/kWh)</label>
          <input
            value={solarData?.selectedElPrice || ""}
            readOnly
            disabled
            placeholder="Strømpris"
            className="border p-2"
          />

          <label>Taktype</label>
          <input
            value={solarData?.selectedRoofType || ""}
            readOnly
            disabled
            placeholder="Taktype"
            className="border p-2"
          />

          <label>Paneltype</label>
          <input
            value={solarData?.selectedPanelType || ""}
            readOnly
            disabled
            placeholder="Paneltype"
            className="border p-2"
          />

          <label>Antall paneler</label>
          <input
            value={solarData?.totalPanels || ""}
            readOnly
            disabled
            placeholder="Antall paneler"
            className="border p-2"
          />

          <label>Desired kWh</label>
          <input
            value={solarData?.desiredKWh || ""}
            readOnly
            disabled
            placeholder="Desired Coverage"
            className="border p-2"
          />

          <label>Coverage %</label>
          <input
            value={solarData?.coveragePercentage || ""}
            readOnly
            disabled
            placeholder="Coverage %"
            className="border p-2"
          />

          <button
            disabled={clientLoading}
            type="submit"
            className="bg-blue-500 text-white p-2 mt-4"
          >
            {clientId ? "Update Client" : "Create Client"}
          </button>
        </form>
      </main>
      {isModalOpen && (
        <section className="flex h-full absolute inset-0 overflow-none">
          <>
            <div
              className="flex h-full w-full absolute bg-black opacity-25"
              onClick={handleToggleModal}
            ></div>
            <iframe
              src="https://pvmap.vercel.app/?site=solarinstallationdashboard"
              className="h-5/6 w-5/6 relative z-50 m-auto rounded-xl"
            />
          </>
        </section>
      )}
    </>
  );
}
