"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useCalculatePrices } from "@/hooks/useCalculatePrices";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

export default function PriceCalculator() {
  const { organizationId } = useAuth();
  const {
    data: orgData,
    loading,
    error,
    updateDocData,
  } = useFirestoreDoc(db, "organizations", organizationId);

  const [data, setData] = useState({});

  useEffect(() => {
    setData(orgData?.priceCalculator || {});
  }, [orgData]);

  const [panelCount, setPanelCount] = useState(24);

  const allFields = {
    Snekker: ["dropdown", "Snekker kostnad", "Påslag elektriker", "Total"],
    "Leverandør Nordic Solergy": [
      "Panel kostnad",
      "Feste kostnad",
      "Invertert Kostnad",
      "Batteri kostnad",
      "Påslag elektriker",
      "Total",
    ],
    Elektriker: [
      "Elektriker arbeid",
      "Tilleggskostnader",
      "Påslag elektriker",
      "Total",
    ],
    "Total kostnad": [
      "Leverandør andel",
      "Elektro andel(snekker)",
      "Soleklart andel",
      "Frakt",
      "Total SUM eks. mva",
      "Total SUM inkl. mva",
      "Enova støtte",
      "Sluttkostnad",
    ],
  };

  const snekkerDropdown = ["Håndverk", "Reparasjon", "Renovering"];

  const handleUpdate = async (category, key, value) => {
    const updatedData = {
      ...data,
      [category]: {
        ...data[category],
        [key]: value,
      },
    };
    setData(updatedData);

    await updateDocData({
      priceCalculator: updatedData,
    });
  };

  const { totalCost } = useCalculatePrices({ panelCount });

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="defaultContainer">
      {totalCost}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(allFields).map(([categoryKey, fields]) => {
          return (
            <div key={categoryKey}>
              <h2 className="font-semibold">{categoryKey}</h2>
              {fields.map((field) => {
                const value = data[categoryKey]?.[field] ?? 0;

                if (categoryKey === "Snekker" && field === "dropdown") {
                  return (
                    <div key={field} className="mb-2">
                      <label className="block font-regular">{field}</label>
                      <select
                        value={value}
                        onChange={(e) =>
                          handleUpdate(categoryKey, field, e.target.value)
                        }
                        className="border p-2 w-full"
                      >
                        {snekkerDropdown.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (typeof value === "number") {
                  return (
                    <div key={field} className="mb-2">
                      <label className="block font-regular">{field}</label>
                      <input
                        type="number"
                        value={value === 0 ? "" : value}
                        min={0}
                        onChange={(e) =>
                          handleUpdate(
                            categoryKey,
                            field,
                            Number(e.target.value)
                          )
                        }
                        className="border p-2 w-full"
                      />
                    </div>
                  );
                }

                if (typeof value === "string") {
                  return (
                    <div key={field} className="mb-2">
                      <label className="block font-semibold">{field}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleUpdate(categoryKey, field, e.target.value)
                        }
                        className="border p-2 w-full"
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          );
        })}
      </section>
    </main>
  );
}
