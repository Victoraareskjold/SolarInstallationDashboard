import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";

export const useCalculatePrices = ({ panelCount }) => {
  const { organizationId } = useAuth();
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!organizationId) return;

    const fetchPriceData = async () => {
      const orgRef = doc(db, "organizations", organizationId);
      const orgSnap = await getDoc(orgRef);

      if (orgSnap.exists()) {
        const priceData = orgSnap.data().priceCalculator || {};

        let costSum = 0;

        costSum += priceData?.Snekker?.["Snekker kostnad"] ?? 0;

        costSum +=
          priceData?.["Leverandør Nordic Solergy"]?.["Panel kostnad"] ?? 0;
        costSum +=
          priceData?.["Leverandør Nordic Solergy"]?.["Feste kostnad"] ?? 0;
        costSum +=
          priceData?.["Leverandør Nordic Solergy"]?.["Invertert Kostnad"] ?? 0;
        costSum +=
          priceData?.["Leverandør Nordic Solergy"]?.["Batteri kostnad"] ?? 0;

        costSum += priceData?.Elektriker?.["Elektriker arbeid"] ?? 0;
        costSum += priceData?.Elektriker?.["Tilleggskostnader"] ?? 0;

        costSum += priceData?.["Total kostnad"]?.["Frakt"] ?? 0;
        costSum += priceData?.["Total kostnad"]?.["Enova støtte"] ?? 0;

        costSum += priceData?.Snekker?.["Påslag elektriker"] ?? 0;
        costSum += priceData?.Elektriker?.["Påslag elektriker"] ?? 0;

        setTotalCost(costSum);
      }
    };

    fetchPriceData();
  }, [organizationId, panelCount]);

  return { totalCost };
};
