import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect } from "react";

export const useCalculatePrices = ({
  setTotals,
  refreshTrigger,
  selectedRoof,
}) => {
  const { organizationId } = useAuth();

  useEffect(() => {
    if (!organizationId) return;

    const fetchPriceData = async () => {
      const orgRef = doc(db, "organizations", organizationId);
      const orgSnap = await getDoc(orgRef);

      if (orgSnap.exists()) {
        const priceData = orgSnap.data().priceCalculator || {};

        const newTotals = {
          snekker: 0,
          elektriker: 0,
          leverandør: 0,
          total: 0,
        };

        //SNEKKER
        const taktekkePris =
          priceData?.snekker?.["Taktekke"]?.[selectedRoof] ?? 0;
        const snekkerKostnad = priceData?.snekker?.["Snekker kostnad"] ?? 0;
        const elektrikerPåslagProsent =
          priceData?.snekker?.["Påslag elektriker %"] ?? 0;

        const snekkerSubtotal = taktekkePris + snekkerKostnad;
        const fratrekk = (snekkerSubtotal * elektrikerPåslagProsent) / 100;

        newTotals.snekker = snekkerSubtotal - fratrekk;

        //LEVERANDØR

        //ELEKTRIKER
        newTotals.elektriker +=
          priceData?.elektriker?.["Elektriker arbeid"] ?? 0;
        newTotals.elektriker +=
          priceData?.elektriker?.["Tilleggskostnader"] ?? 0;
        newTotals.elektriker +=
          priceData?.elektriker?.["Påslag elektriker"] ?? 0;

        //TOTAL KOSTNAD
        /* newTotals.total = Object.entries(newTotals)
          .filter(([key]) => key != "total")
          .reduce((sum, [, value]) => sum + value, 0); */

        setTotals(newTotals);
      }
    };

    fetchPriceData();
  }, [organizationId, setTotals, refreshTrigger, selectedRoof]);

  return null;
};
