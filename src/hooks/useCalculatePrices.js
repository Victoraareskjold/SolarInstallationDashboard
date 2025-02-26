import { useEffect, useState } from "react";

export const useCalculatePrices = ({ panelCount }) => {
  const [totalCost, setTotalCost] = useState(150);

  useEffect(() => {
    if (!panelCount) return;

    const calculatedCost = 150 * panelCount;
    setTotalCost(calculatedCost);
  }, [panelCount]);

  return { totalCost };
};
