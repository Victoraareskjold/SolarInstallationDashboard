"use client";

import { useEffect, useState } from "react";

export default function CreateClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [solarData, setSolarData] = useState(null);
  const [solarData, setSolarData] = useState({
    name: "asd",
    email: "asd",
    phone: "asd",
    checked: true,
    checkedRoofData: [
      {
        roofId: 4,
        adjustedPanelCount: 10,
        maxPanels: 20,
        direction: 246,
        angle: 0.07999999821186066,
      },
      {
        roofId: 2,
        adjustedPanelCount: 4,
        maxPanels: 8,
        direction: 279,
        angle: 23.34000015258789,
      },
    ],
    selectedElPrice: 1.5,
    selectedRoofType: "Takstein (Dobbelkrummet)",
    selectedPanelType: "Premium 440 W",
    totalPanels: 14,
    yearlyCost: 3025,
    yearlyCost2: 3245,
    yearlyProd: 5396.065,
    address: "Strømbråtenveien 3, Vestby",
    site: "solarinstallationdashboard",
    desiredKWh: "",
    coveragePercentage: 40,
  });

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

  const handleCreateClient = (e) => {
    e.preventDefault();
    console.log("Creating client!");
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <main className="p-2 flex flex-col gap-4">
        <div>
          <h1>Create new client</h1>
        </div>
        <button onClick={handleToggleModal}>
          {isModalOpen ? "Close modal" : "Open modal"}
        </button>
        <form onSubmit={handleCreateClient} className="flex flex-col gap-3">
          <label>Fullt navn</label>
          <input
            value={solarData?.name || ""}
            readOnly
            placeholder="Navn"
            className="border p-2"
          />

          {solarData?.checkedRoofData?.length > 0 && (
            <div>
              <h2 className="font-bold mb-2">Takflater</h2>
              {solarData.checkedRoofData.map((roof, index) => (
                <div key={index} className="p-4 mb-2">
                  <p>Tak ID: {roof.roofId}</p>
                  <div className="flex flex-row justify-between gap-2">
                    <div className="w-full">
                      <label>Paneler</label>
                      <input
                        value={roof.adjustedPanelCount}
                        readOnly
                        className="border p-2 w-full"
                      />
                    </div>

                    <div className="w-full">
                      <label>Maks paneler</label>
                      <input
                        value={roof.maxPanels}
                        readOnly
                        className="border p-2 w-full"
                      />
                    </div>

                    <div className="w-full">
                      <label>Retning</label>
                      <input
                        value={roof.direction}
                        readOnly
                        className="border p-2 w-full"
                      />
                    </div>

                    <div className="w-full">
                      <label>Vinkel</label>
                      <input
                        value={roof.angle.toFixed(0)}
                        readOnly
                        className="border p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label>E-post</label>
          <input
            value={solarData?.email || ""}
            readOnly
            placeholder="E-post"
            className="border p-2"
          />

          <label>Telefon</label>
          <input
            value={solarData?.phone || ""}
            readOnly
            placeholder="Telefon"
            className="border p-2"
          />

          <label>Adresse</label>
          <input
            value={solarData?.address || ""}
            readOnly
            placeholder="Adresse"
            className="border p-2"
          />

          <label>Årlig produksjon (kWh)</label>
          <input
            value={solarData?.yearlyProd || ""}
            readOnly
            placeholder="Årlig produksjon"
            className="border p-2"
          />

          <label>Strømpris (kr/kWh)</label>
          <input
            value={solarData?.selectedElPrice || ""}
            readOnly
            placeholder="Strømpris"
            className="border p-2"
          />

          <label>Taktype</label>
          <input
            value={solarData?.selectedRoofType || ""}
            readOnly
            placeholder="Taktype"
            className="border p-2"
          />

          <label>Paneltype</label>
          <input
            value={solarData?.selectedPanelType || ""}
            readOnly
            placeholder="Paneltype"
            className="border p-2"
          />

          <label>Antall paneler</label>
          <input
            value={solarData?.totalPanels || ""}
            readOnly
            placeholder="Antall paneler"
            className="border p-2"
          />

          <label>Coverage %</label>
          <input
            value={solarData?.coveragePercentage || ""}
            readOnly
            placeholder="Coverage %"
            className="border p-2"
          />

          <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
            Opprett klient
          </button>
        </form>
      </main>
      {isModalOpen && (
        <section className="flex h-full absolute inset-0">
          <>
            <div
              className="flex h-full w-full absolute bg-black opacity-25"
              onClick={handleToggleModal}
            ></div>
            <iframe
              src="https://pvmap.vercel.app/?site=solarinstallationdashboard"
              className="h-full lg:!pb-0 relative z-50 m-auto"
              width="90%"
              style={{ paddingTop: "72px" }}
            />
          </>
        </section>
      )}
    </>
  );
}
