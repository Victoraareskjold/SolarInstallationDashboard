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
import CreateClientField from "@/components/CreateClientFeld";
import Loading from "@/components/Loading";
import PriceDisplay from "@/components/calculator/PriceDisplay";

export default function CreateClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const { user, organizationId } = useAuth();
  const [solarData, setSolarData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Data for priceDisplay
  const {
    data: orgData,
    loading,
    error: dataError,
  } = useFirestoreDoc(db, "organizations", organizationId);
  const [data, setData] = useState({});
  const [selectedRoof, setSelectedRoof] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("");
  const [selectedFeste, setSelectedFeste] = useState("");
  const [selectedExtras, setSelectedExtras] = useState([
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
  ]);
  const [selectedInverter, setSelectedInverter] = useState([
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
  ]);
  const [selectedInverter2, setSelectedInverter2] = useState([
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
  ]);
  const [selectedBattery, setSelectedBattery] = useState([
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggleMenu = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    setData(orgData?.priceCalculator || {});
  }, [orgData]);

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
    console.log("first");
    e.preventDefault();

    if (!solarData) {
      alert("Missing solardata!");
      return;
    }

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
      checkedRoofData: solarData?.checkedRoofData || null,
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

  const handleToggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <main className="defaultContainer">
        <BackButton />
        <div>
          <h1>{clientId ? solarData?.address : "Create new client"}</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleCreateClient}
          className="flex flex-col gap-12 w-full"
        >
          {/* Client data */}
          <div className="gap-3 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
            <CreateClientField
              label={"Fullt navn"}
              value={solarData?.name}
              setSolarData={setSolarData}
              field="name"
            />
            <CreateClientField
              label={"E-post"}
              value={solarData?.email}
              setSolarData={setSolarData}
              field="email"
            />
            <CreateClientField
              label={"Telefon"}
              value={solarData?.phone}
              setSolarData={setSolarData}
              field="phone"
            />
            <CreateClientField
              label={"Addresse"}
              value={solarData?.address}
              setSolarData={setSolarData}
              field="address"
            />
          </div>

          {/* Strøm data */}
          <div className="gap-3 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
            <CreateClientField
              label={"Årlig produksjon (kWh)"}
              value={solarData?.yearlyProd}
              readOnly
            />
            <CreateClientField
              label={"Strømpris (kr/kWh)"}
              value={solarData?.selectedElPrice}
              readOnly
            />
            <CreateClientField
              label={"Taktype"}
              value={solarData?.selectedRoofType}
              readOnly
            />
            <CreateClientField
              label={"Paneltype"}
              value={solarData?.selectedPanelType}
              readOnly
              field="selectedPanelType"
            />
            <CreateClientField
              label={"Antall paneler"}
              value={solarData?.totalPanels}
              readOnly
            />
            <CreateClientField
              label={"Desired kWh"}
              value={solarData?.desiredKWh}
              readOnly
            />
            <CreateClientField
              label={"Coverage %"}
              value={solarData?.coveragePercentage}
              readOnly
            />
          </div>

          {solarData?.checkedRoofData?.length > 0 && (
            <div className="flex flex-col gap-3 w-full">
              {solarData?.checkedRoofData?.map((roof, index) => (
                <div key={index} className="p-0 mb-2 w-full">
                  <div className="gap-3 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 items-center">
                    <CreateClientField
                      label={"Tak ID"}
                      value={roof.roofId}
                      readOnly
                    />
                    <CreateClientField
                      label={"Paneler"}
                      value={roof.adjustedPanelCount}
                      readOnly
                    />
                    <CreateClientField
                      label={"Maks paneler"}
                      value={roof.maxPanels}
                      readOnly
                    />
                    <CreateClientField
                      label={"Retning"}
                      value={roof.direction}
                      readOnly
                    />
                    <CreateClientField
                      label={"Vinkel"}
                      value={roof.angle.toFixed(0)}
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <section>
            <p>Legg til bilde</p>
            <div className="relative flex flex-col bg-slate-200 max-w-96">
              <ImageUploadComponent setImageUrl={setImageUrl} />
              {/* {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Bilde"
                fill
                className="object-contain rounded-lg shadow-md"
              />
            ) : null} */}
            </div>
          </section>

          <div className="flex flex-row gap-4">
            <button
              onClick={handleToggleMenu}
              className="smallLightButton max-w-64"
            >
              {isMenuOpen ? "Close price menu" : "View price menu"}
            </button>
            <button
              onClick={handleToggleModal}
              className="smallLightButton max-w-64"
            >
              {isModalOpen ? "Close pvmap" : "Open pvmap"}
            </button>
            <button
              disabled={clientLoading}
              type="submit"
              className="darkButton max-w-64"
            >
              {clientId ? "Update Client" : "Create Client"}
            </button>
          </div>

          <div>
            {isMenuOpen && (
              <PriceDisplay
                data={data}
                //priceFields={priceFields}
                selectedRoof={selectedRoof}
                setSelectedRoof={setSelectedRoof}
                selectedPanel={selectedPanel}
                setSelectedPanel={setSelectedPanel}
                selectedFeste={selectedFeste}
                setSelectedFeste={setSelectedFeste}
                selectedInverter={selectedInverter}
                setSelectedInverter={setSelectedInverter}
                selectedInverter2={selectedInverter2}
                setSelectedInverter2={setSelectedInverter2}
                selectedBattery={selectedBattery}
                setSelectedBattery={setSelectedBattery}
                selectedExtras={selectedExtras}
                setSelectedExtras={setSelectedExtras}
                panelCount={solarData?.totalPanels}
                solarDataSelectedPanelType={solarData?.selectedPanelType}
              />
            )}
          </div>
        </form>
      </main>

      {/* Modal */}
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
