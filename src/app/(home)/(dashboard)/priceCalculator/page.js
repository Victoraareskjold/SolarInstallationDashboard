"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { allFields, snekkerDropdown } from "@/constants/priceFields";

export default function PriceCalculator() {
  const { organizationId } = useAuth();
  const {
    data: orgData,
    loading,
    error,
    updateDocData,
  } = useFirestoreDoc(db, "organizations", organizationId);

  const [data, setData] = useState({});
  const [currentSelected, setCurrentSelected] = useState(snekkerDropdown[0]);

  const [snekkerTotal, setSnekkerTotal] = useState(0);

  useEffect(() => {
    setData(orgData?.priceCalculator || {});
  }, [orgData]);

  const handleUpdate = async (category, key, value) => {
    if (category === "Snekker" && key === "Taktekke") {
      const updatedData = {
        ...data,
        [category]: {
          ...data[category],
          [key]: {
            ...data[category]?.[key],
            [currentSelected]: value, // Oppdater kun den valgte taktypen
          },
        },
      };
      setData(updatedData);

      // Oppdater i databasen
      await updateDocData({
        priceCalculator: updatedData,
      });
    } else {
      // Hvis det er en generell verdi (som Snekker kostnad eller Påslag elektriker)
      const updatedData = {
        ...data,
        [category]: {
          ...data[category],
          [key]: value, // Oppdater den generelle verdien
        },
      };
      setData(updatedData);

      // Oppdater i databasen
      if (key != "Total") {
        await updateDocData({
          priceCalculator: updatedData,
        });
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="defaultContainer">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(allFields).map(([categoryKey, fields]) => (
          <div key={categoryKey}>
            <h2 className="font-semibold">{categoryKey}</h2>
            {fields.map((field) => {
              let value = data[categoryKey]?.[field] ?? 0;

              // Hvis det er for Taktekke (som har flere taktyper)
              if (categoryKey === "Snekker" && field === "Taktekke") {
                return (
                  <div key={field} className="mb-2">
                    <label className="block font-regular">{field}</label>
                    <select
                      value={currentSelected}
                      onChange={(e) => setCurrentSelected(e.target.value)}
                      className="border p-2 w-full"
                    >
                      {snekkerDropdown.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="mt-3">
                      <label className="block font-regular">
                        {field} ({currentSelected})
                      </label>
                      <input
                        type="number"
                        value={value?.[currentSelected] ?? ""}
                        placeholder={0}
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
                  </div>
                );
              }

              // Generelle felter som Snekker kostnad, Påslag elektriker, etc.
              if (typeof value === "number") {
                return (
                  <div key={field} className="mb-2">
                    <label className="block font-regular">{field}</label>
                    <input
                      type="number"
                      value={value === 0 ? "" : value}
                      placeholder={0}
                      min={0}
                      onChange={(e) =>
                        handleUpdate(categoryKey, field, Number(e.target.value))
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
        ))}
      </section>
    </main>
  );
}
