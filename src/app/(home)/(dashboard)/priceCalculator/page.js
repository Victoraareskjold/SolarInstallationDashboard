"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { allFields, snekkerDropdown } from "@/constants/priceFields";
import { useCalculatePrices } from "@/hooks/useCalculatePrices";

export default function PriceCalculator() {
  const { organizationId } = useAuth();
  const {
    data: orgData,
    loading,
    error,
    updateDocData,
  } = useFirestoreDoc(db, "organizations", organizationId);

  const [data, setData] = useState({});

  //DROPDOWNS
  const [selectedRoof, setSelectedRoof] = useState(snekkerDropdown[0]);

  //TOTALS
  const [snekkerTotal, setSnekkerTotal] = useState(0);
  const [leverandørTotal, setLeverandørTotal] = useState(0);
  const [elektrikerTotal, setElektrikerTotal] = useState(0);

  const [totals, setTotals] = useState({
    snekker: 0,
    leverandør: 0,
    elektriker: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setTotals({
      snekker: snekkerTotal,
      elektriker: elektrikerTotal,
      leverandør: leverandørTotal,
    });
  }, [snekkerTotal, elektrikerTotal, leverandørTotal]);

  useEffect(() => {
    setData(orgData?.priceCalculator || {});
  }, [orgData]);

  useCalculatePrices({ setTotals, refreshTrigger, selectedRoof });

  const handleUpdate = async (category, key, value) => {
    if (category === "snekker" && key === "Taktekke") {
      const updatedData = {
        ...data,
        [category]: {
          ...data[category],
          [key]: {
            ...data[category]?.[key],
            [selectedRoof]: value,
          },
        },
      };
      setData(updatedData);

      await updateDocData({
        priceCalculator: updatedData,
      });
    } else {
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
    }
    setRefreshTrigger((prev) => prev + 1);
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

              if (categoryKey === "snekker" && field === "Taktekke") {
                return (
                  <div key={field} className="mb-2">
                    <label className="block font-regular">{field}</label>
                    <select
                      value={selectedRoof}
                      onChange={(e) => setSelectedRoof(e.target.value)}
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
                        {field} ({selectedRoof})
                      </label>
                      <input
                        type="number"
                        value={value?.[selectedRoof] ?? ""}
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

              if (field === "Total") {
                return (
                  <div key={field} className="mb-2">
                    <label className="block font-semibold">{field}</label>
                    <input
                      type="number"
                      value={totals[categoryKey] ?? 0}
                      placeholder={0}
                      readOnly
                      className="border p-2 w-full"
                    />
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
                    <label className="block font-regular">{field}</label>
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
