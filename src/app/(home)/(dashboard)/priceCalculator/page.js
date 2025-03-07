"use client";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { doc, updateDoc, deleteField } from "firebase/firestore"; // Importer nødvendige Firebase-metoder
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { priceFields, categoryFields } from "@/constants/priceFields";
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

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [panelCount, setPanelCount] = useState(10);

  useEffect(() => {
    setData(orgData?.priceCalculator || {});
  }, [orgData]);

  const handleUpdate = async (inputName, category, field, value) => {
    if (!category && !field && value === undefined) {
      const updatedData = {
        ...data,
        [inputName]: {
          ...data[inputName],
        },
      };

      setData(updatedData);

      await updateDocData({
        priceCalculator: updatedData,
      });
      return;
    }
    const updatedData = {
      ...data,
      [category]: {
        ...data[category],
        [inputName]: {
          ...data[category]?.[inputName],
          [field]: value,
        },
      },
    };

    setData(updatedData);

    await updateDocData({
      priceCalculator: updatedData,
    });
  };

  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddNewRow = async (category, newCategoryName) => {
    if (newCategoryName.trim() == "") {
      alert("Field cannot be empty");
      return;
    }
    const updatedData = {
      ...data,
      [category]: {
        ...data[category],
        [newCategoryName]: {},
      },
    };

    setData(updatedData);
    setNewCategoryName("");

    await updateDocData({
      priceCalculator: updatedData,
    });
  };

  const handleDeleteRow = async (category, inputName) => {
    const updatedData = { ...data };
    delete updatedData[category][inputName];
    setData(updatedData);
    const docRef = doc(db, "organizations", organizationId);
    await updateDoc(docRef, {
      [`priceCalculator.${category}.${inputName}`]: deleteField(),
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
          panelCount={panelCount}
        />
      )}

      <PriceInputs
        data={data}
        priceFields={priceFields}
        categoryFields={categoryFields}
        handleUpdate={handleUpdate}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />
    </main>
  );
}
