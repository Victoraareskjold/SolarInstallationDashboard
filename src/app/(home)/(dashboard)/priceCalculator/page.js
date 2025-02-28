"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import {
  allFields,
  roofTypes,
  roofFields,
  snekkerDropdown,
} from "@/constants/priceFields";
import { useCalculatePrices } from "@/hooks/useCalculatePrices";
import PriceDisplay from "@/components/calculator/PriceDisplay";
import PriceInputs from "@/components/calculator/PriceInputs";

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

  const [totals, setTotals] = useState({
    snekker: 0,
    leverandør: 0,
    elektriker: 0,
    total: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      <PriceDisplay
        data={data}
        allFields={allFields}
        setSelectedRoof={setSelectedRoof}
        selectedRoof={selectedRoof}
        snekkerDropdown={snekkerDropdown}
        totals={totals}
        handleUpdate={handleUpdate}
      />
      <PriceInputs
        data={data}
        roofTypes={roofTypes}
        roofFields={roofFields}
        handleUpdate={handleUpdate}
      />
    </main>
  );
}
