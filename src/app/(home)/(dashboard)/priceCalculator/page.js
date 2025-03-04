"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { priceFields, categoryFields } from "@/constants/priceFields";
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

  const [selectedExtras, setSelectedExtras] = useState([
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
    { type: "", count: 1, cost: 0, markup: 0 },
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [panelCount, setPanelCount] = useState(10);

  useEffect(() => {
    setData(orgData?.priceCalculator || {});
  }, [orgData]);

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
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="defaultContainer">
      <button onClick={handleToggleMenu}>
        {isMenuOpen ? "Close menu" : "View menu"}
      </button>
      {isMenuOpen && (
        <PriceDisplay
          data={data}
          priceFields={priceFields}
          setSelectedRoof={setSelectedRoof}
          selectedExtras={selectedExtras}
          setSelectedExtras={setSelectedExtras}
          selectedRoof={selectedRoof}
          panelCount={panelCount}
        />
      )}

      <PriceInputs
        data={data}
        priceFields={priceFields}
        categoryFields={categoryFields}
        handleUpdate={handleUpdate}
      />
    </main>
  );
}
