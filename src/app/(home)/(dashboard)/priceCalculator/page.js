"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import {
  allFields,
  priceFields,
  priceCategories,
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
  const [selectedRoof, setSelectedRoof] = useState(
    Object.keys(priceFields["Ulike taktekker"])[0]
  );

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

  const handleUpdate = async (category, taktype, field, value) => {
    const updatedData = {
      ...data,
      [category]: {
        ...data[category],
        [taktype]: {
          ...data[category]?.[taktype],
          [field]: value,
        },
      },
    };

    setData(updatedData);

    await updateDocData({
      priceCalculator: updatedData,
    });

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
        priceFields={priceFields}
        setSelectedRoof={setSelectedRoof}
        selectedRoof={selectedRoof}
        totals={totals}
      />
      <PriceInputs
        data={data}
        priceFields={priceFields}
        priceCategories={priceCategories}
        handleUpdate={handleUpdate}
      />
    </main>
  );
}
