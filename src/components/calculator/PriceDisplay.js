import { useEffect } from "react";
import DisplayInputField from "./DisplayInputField";

export default function PriceDisplay({
  data,
  selectedRoof,
  setSelectedRoof,
  selectedPanel,
  setSelectedPanel,
  selectedFeste,
  setSelectedFeste,
  selectedInverter,
  setSelectedInverter,
  selectedInverter2,
  setSelectedInverter2,
  selectedBattery,
  setSelectedBattery,
  selectedExtras,
  setSelectedExtras,
  panelCount,
  solarDataSelectedPanelType,
  solarDataSelectedRoofType,
}) {
  //use state for dropdowns
  //use state for dropdowns
  //use state for dropdowns
  const selectedRoofData = data["Ulike taktekker"]?.[selectedRoof] || {};
  const selectedPanelData = data["Paneler"]?.[selectedPanel] || {};
  const selectedFesteData = data["Festemateriell"]?.[selectedFeste] || {};

  // Shorthands
  // Shorthands
  // Shorthands
  const selectedElectricianData = data["Arbeid fra elektriker"] || {};

  //total calculator
  //total calculator
  //total calculator
  const calculateTotalCost = (items) =>
    items.reduce((sum, item) => sum + item.count * (item.cost || 0), 0);

  // Produktvalg og leverandør
  // Produktvalg og leverandør
  // Produktvalg og leverandør
  const panelCost = selectedPanelData["Kostnad pr."] * panelCount || 0;
  const festeCost = selectedFesteData["Kostnad pr."] * panelCount || 0;

  const inverterCost = calculateTotalCost(selectedInverter);
  const inverterCost2 = calculateTotalCost(selectedInverter2);
  const batteryCost = calculateTotalCost(selectedBattery);
  const totalProductCost =
    panelCost + festeCost + inverterCost + inverterCost2 + batteryCost;

  const leverandørPåslagElektriker = (
    selectedPanelData["Påslag elektriker %"] * totalProductCost
  ).toFixed(0);
  const leverandørTotalTotal =
    Number(totalProductCost) + Number(leverandørPåslagElektriker);

  // Set selectedpanel to paneltype from estimate
  useEffect(() => {
    if (
      Object.keys(data["Paneler"] || {}).includes(solarDataSelectedPanelType)
    ) {
      setSelectedPanel(solarDataSelectedPanelType);
    }
  }, [data, setSelectedPanel, solarDataSelectedPanelType]);

  // Set selectedRoof to rooftype from estimate
  useEffect(() => {
    if (
      Object.keys(data["Ulike taktekker"] || {}).includes(
        solarDataSelectedRoofType
      )
    ) {
      setSelectedRoof(solarDataSelectedRoofType);
    }
  }, [data, setSelectedRoof, solarDataSelectedRoofType]);

  // Set feste based on roofType
  useEffect(() => {
    if (!selectedRoof) return;

    const festeForTak = data["Ulike taktekker"]?.[selectedRoof]?.selectedFeste;

    if (festeForTak) {
      setSelectedFeste(festeForTak);
    }
  }, [selectedRoof, data, setSelectedFeste]);

  // Find kwt usage and set inverter
  useEffect(() => {
    if (!solarDataSelectedPanelType) return;

    const panelWattage = getNumbers(selectedPanel);
    const kwt = (panelCount * panelWattage) / 1000;

    const inverterMap = Object.keys(data["Inverter string 230V"]).reduce(
      (acc, inverter) => {
        const num = getNumbers(inverter);
        if (num !== undefined) {
          acc[Number(num)] = inverter;
        }
        return acc;
      },
      {}
    );

    const sortedInverters = Object.keys(inverterMap)
      .map(Number)
      .sort((a, b) => a - b);

    let selectedInverterKey = sortedInverters[0];
    for (let i = 0; i < sortedInverters.length; i++) {
      if (kwt >= sortedInverters[i]) {
        selectedInverterKey = sortedInverters[i];
      } else {
        break;
      }
    }

    const solarDataSelectedInverter = inverterMap[selectedInverterKey];

    setSelectedInverter([
      {
        type: solarDataSelectedInverter,
        count: 1,
      },
      {
        type: "",
        count: 1,
      },
      {
        type: "",
        count: 1,
      },
    ]);
  }, [
    selectedPanel,
    panelCount,
    data,
    solarDataSelectedPanelType,
    setSelectedInverter,
  ]);

  // Snekker
  // Snekker
  // Snekker
  const snekkerKostnad = selectedRoofData["Snekker kostnad pr. panel"];
  const snekkerTotal = panelCount * snekkerKostnad;
  const påslagElektriker = selectedRoofData["Påslag elektriker %"];
  const påslagIKr = snekkerTotal * påslagElektriker;
  const snekkerTotalTotal = snekkerTotal + påslagIKr;

  // Elektriker
  // Elektriker
  // Elektriker
  const elektrikerPåslagIKr1 =
    selectedElectricianData?.["Føring fra tak til inverter"]?.["Kostnad pr."] *
    selectedElectricianData?.["Føring fra tak til inverter"]?.[
      "Påslag elektriker %"
    ];
  const elektrikerWork1 =
    selectedElectricianData["Føring fra tak til inverter"]?.["Kostnad pr."] +
    elektrikerPåslagIKr1;

  const elektrikerPåslagIKr2 =
    selectedElectricianData?.["Sikring + opplegg til inverter"]?.[
      "Kostnad pr."
    ] *
    selectedElectricianData?.["Sikring + opplegg til inverter"]?.[
      "Påslag elektriker %"
    ];
  const elektrikerWork2 =
    selectedElectricianData["Sikring + opplegg til inverter"]?.["Kostnad pr."] +
    elektrikerPåslagIKr2;

  const elektrikerPåslagIKr3 =
    selectedElectricianData?.["Dokumentasjon/søknad til nettselskap"]?.[
      "Kostnad pr."
    ] *
    selectedElectricianData?.["Dokumentasjon/søknad til nettselskap"]?.[
      "Påslag elektriker %"
    ];
  const elektrikerWork3 =
    selectedElectricianData["Dokumentasjon/søknad til nettselskap"]?.[
      "Kostnad pr."
    ] + elektrikerPåslagIKr3;
  const elektrikerWorkTotal =
    elektrikerWork1 + elektrikerWork2 + elektrikerWork3;

  const elektrikerStillasePåslag =
    selectedElectricianData?.["Stillase (gjelder for en side)	"]?.[
      "Kostnad pr."
    ] *
    selectedElectricianData?.["Stillase (gjelder for en side)	"]?.[
      "Påslag elektriker %"
    ];
  const elektrikerWorkStillase =
    selectedElectricianData["Stillase (gjelder for en side)	"]?.["Kostnad pr."] +
    elektrikerStillasePåslag;

  const elekriterWorkTotalTotal = elektrikerWorkTotal + elektrikerWorkStillase;

  // Elektriker tilleggskostnader
  // Elektriker tilleggskostnader
  // Elektriker tilleggskostnader
  const totalExtrasCost = calculateTotalCost(selectedExtras);

  // Total kostnad
  // Total kostnad
  // Total kostnad
  const leverandørAndel = Number(totalProductCost);
  const elektroAndelAndSnekker =
    Number(snekkerTotalTotal) + Number(elekriterWorkTotalTotal);
  // Legg til if statement for antall paneler
  const soleklartAndel = Number(
    0.28 * (leverandørAndel + elektroAndelAndSnekker)
  );
  // 2000 if 36 <= paneler og 4000 if 36 >
  const frakt = panelCount <= 36 ? 2000 : 4000;
  const totalSumEksMva =
    Number(frakt) +
    Number(soleklartAndel) +
    Number(leverandørAndel) +
    Number(elektroAndelAndSnekker);
  const totalSumInklMva = totalSumEksMva * 1.25;
  const enovaStøtte = 10000;
  const sluttkostnad = totalSumInklMva - enovaStøtte;

  // Generell kode
  // Generell kode
  // Generell kode
  const handleChange = (
    index,
    key,
    value,
    selectedItems,
    setSelectedItems,
    category
  ) => {
    const newItems = [...selectedItems];
    newItems[index][key] = value;

    if (key === "type") {
      const extraData = data[category]?.[value] || {};
      newItems[index].cost = extraData["Kostnad pr."] || 0;
      newItems[index].markup = extraData["Påslag elektriker %"] || 0;
    }

    setSelectedItems(newItems);
  };
  // Get panelwattage number
  const getNumbers = (str) => {
    let matches = str.match(/(\d+)/);

    if (matches) {
      return matches[0];
    }
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
      {/* Produktvalg */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Produktvalg</h2>

        <div className="">
          <label className="block font-regular">Type solcellepanel</label>
          <select
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled hidden>
              -- Velg panel --
            </option>
            {Object.keys(data["Paneler"] || {}).map((panel) => (
              <option key={panel} value={panel}>
                {panel}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label className="block font-regular">Type feste</label>
          <select
            value={selectedFeste}
            onChange={(e) => setSelectedFeste(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled hidden>
              -- Velg feste --
            </option>
            {Object.keys(data["Festemateriell"] || {}).map((feste) => (
              <option key={feste} value={feste}>
                {feste}
              </option>
            ))}
          </select>
        </div>

        {/* Type inverter - 4 "tileegsdropdown" */}
        {selectedInverter.map((extra, index) => {
          const selectedValues = selectedInverter
            .filter((_, i) => i !== index)
            .map((e) => e.type);

          return (
            <div key={index} className="">
              <select
                value={extra.type}
                onChange={(e) =>
                  handleChange(
                    index,
                    "type",
                    e.target.value,
                    selectedInverter,
                    setSelectedInverter,
                    "Inverter string 230V"
                  )
                }
                className="w-full bg-transparent"
              >
                <option value="" disabled hidden>
                  -- Legg til inverter string 230V --
                </option>
                {Object.keys(data["Inverter string 230V"] || {})
                  .filter((option) => !selectedValues.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                min="0"
                value={extra.type ? extra.count : 0}
                onChange={(e) =>
                  handleChange(
                    index,
                    "count",
                    e.target.value,
                    selectedInverter,
                    setSelectedInverter,
                    "Inverter string 230V"
                  )
                }
                disabled={!extra.type}
                className="border p-2 w-full"
              />
            </div>
          );
        })}
        {selectedInverter2.map((extra, index) => {
          const selectedValues = selectedInverter2
            .filter((_, i) => i !== index)
            .map((e) => e.type);

          return (
            <div key={index} className="">
              <select
                value={extra.type}
                onChange={(e) =>
                  handleChange(
                    index,
                    "type",
                    e.target.value,
                    selectedInverter2,
                    setSelectedInverter2,
                    "Inverter string 400V"
                  )
                }
                className="w-full bg-transparent"
              >
                <option value="" disabled hidden>
                  -- Legg til inverter string 400V --
                </option>
                {Object.keys(data["Inverter string 400V"] || {})
                  .filter((option) => !selectedValues.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                min="0"
                value={extra.type ? extra.count : 0}
                onChange={(e) =>
                  handleChange(
                    index,
                    "count",
                    e.target.value,
                    selectedInverter2,
                    setSelectedInverter2,
                    "Inverter string 400V"
                  )
                }
                disabled={!extra.type}
                className="border p-2 w-full"
              />
            </div>
          );
        })}

        {/* Type batteri - 4 "tilleggsdropdown" */}
        {selectedBattery.map((extra, index) => {
          const selectedValues = selectedBattery
            .filter((_, i) => i !== index)
            .map((e) => e.type);

          return (
            <div key={index} className="">
              <select
                value={extra.type}
                onChange={(e) =>
                  handleChange(
                    index,
                    "type",
                    e.target.value,
                    selectedBattery,
                    setSelectedBattery,
                    "Batteri"
                  )
                }
                className="w-full bg-transparent"
              >
                <option value="" disabled hidden>
                  -- Legg til batteri --
                </option>
                {Object.keys(data["Batteri"] || {})
                  .filter((option) => !selectedValues.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                min="0"
                value={extra.type ? extra.count : 0}
                onChange={(e) =>
                  handleChange(
                    index,
                    "count",
                    e.target.value,
                    selectedBattery,
                    setSelectedBattery,
                    "Batteri"
                  )
                }
                disabled={!extra.type}
                className="border p-2 w-full"
              />
            </div>
          );
        })}

        <DisplayInputField
          label="Total eks. mva"
          value={totalProductCost || 0}
        />
      </section>

      {/* Leverandør Nordic Solergy */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Leverandør Nordic Solergy</h2>

        <DisplayInputField label={"Panel kostnad"} value={panelCost || 0} />
        <DisplayInputField label={"Feste kostnad"} value={festeCost || 0} />
        <DisplayInputField
          label={"Inverter Kostnad"}
          value={inverterCost + inverterCost2 || 0}
        />
        <DisplayInputField label={"Batteri kostnad"} value={batteryCost || 0} />
        <DisplayInputField
          label={"Påslag elektriker i kr."}
          value={leverandørPåslagElektriker || 0}
        />
        <DisplayInputField
          label={"Total eks. mva"}
          value={leverandørTotalTotal || 0}
        />
      </section>

      {/* Total kostnad */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Total kostnad</h2>
        <DisplayInputField
          label={"Leverandør andel"}
          value={leverandørAndel || 0}
        />

        {/* snekkertot +eletot + eletilleggtot + påslag leverandør elektriker */}
        <DisplayInputField
          label={"Elektro andel + snekker"}
          value={elektroAndelAndSnekker.toFixed(0) || 0}
        />
        <DisplayInputField
          label={"Soleklart andel"}
          value={soleklartAndel.toFixed(0) || 0}
        />
        <DisplayInputField label={"Frakt"} value={frakt.toFixed(0) || 0} />
        <DisplayInputField
          label={"Total SUM eks. mva"}
          value={totalSumEksMva.toFixed(0) || 0}
        />
        <DisplayInputField
          label={"Total SUM inkl. mva"}
          value={totalSumInklMva.toFixed(0) || 0}
        />
        <DisplayInputField
          label={"Enova støtte"}
          value={enovaStøtte.toFixed(0) || 0}
        />
        <DisplayInputField
          label={"Sluttkostnad"}
          value={sluttkostnad.toFixed(0) || 0}
        />
      </section>

      {/* Snekker section */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Snekker</h2>

        <div className="">
          <label className="block font-regular">Taktekke</label>
          <select
            value={selectedRoof}
            onChange={(e) => setSelectedRoof(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled hidden>
              -- Velg taktekke --
            </option>
            {Object.keys(data["Ulike taktekker"] || {}).map((roofName) => (
              <option key={roofName} value={roofName}>
                {roofName}
              </option>
            ))}
          </select>
        </div>

        <DisplayInputField
          label={"Snekker kostnad pr. panel"}
          value={selectedRoofData["Snekker kostnad pr. panel"] || 0}
        />
        <DisplayInputField
          label={"Snekker total kostnad"}
          value={snekkerTotal || 0}
        />
        <DisplayInputField
          label={"Påslag elektriker %"}
          value={selectedRoofData["Påslag elektriker %"] || 0}
        />
        <DisplayInputField label={"Påslag i Kr"} value={påslagIKr || 0} />
        <DisplayInputField
          label={"Total eks. mva"}
          value={snekkerTotalTotal || 0}
        />
      </section>

      {/* Elektriker section */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Elektriker</h2>

        <DisplayInputField
          label={"Elektriker arbeid + påslag"}
          value={elektrikerWorkTotal || 0}
        />
        <DisplayInputField
          label={"Stillase (gjelder for en side)	 + påslag"}
          value={elektrikerWorkStillase || 0}
        />
        <DisplayInputField
          label={"Total eks. mva"}
          value={elekriterWorkTotalTotal || 0}
        />
      </section>

      {/* Elektriker tilleggskostnader section */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Elektriker Tilleggskostnader</h2>
        {selectedExtras.map((extra, index) => {
          const selectedValues = selectedExtras
            .filter((_, i) => i !== index)
            .map((e) => e.type);

          return (
            <div key={index} className="">
              <select
                value={extra.type}
                onChange={(e) =>
                  handleChange(
                    index,
                    "type",
                    e.target.value,
                    selectedExtras,
                    setSelectedExtras,
                    "Tilleggsarbeid fra elektriker"
                  )
                }
                className="w-full bg-transparent"
              >
                <option value="" disabled hidden>
                  -- Legg til tilleggskostnad --
                </option>
                {Object.keys(data["Tilleggsarbeid fra elektriker"] || {})
                  .filter((option) => !selectedValues.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                min="0"
                value={extra.type ? extra.count : 0}
                onChange={(e) =>
                  handleChange(
                    index,
                    "count",
                    e.target.value,
                    selectedExtras,
                    setSelectedExtras,
                    "Tilleggsarbeid fra elektriker"
                  )
                }
                disabled={!extra.type}
                className="border p-2 w-full"
              />
            </div>
          );
        })}
        <DisplayInputField
          label="Kombinert kostnad"
          value={totalExtrasCost || 0}
        />
        <DisplayInputField
          label="Påslag elektriker i kr."
          value={totalExtrasCost * 0.2 || 0}
        />
        <DisplayInputField
          label="Total eks. mva"
          value={totalExtrasCost * 1.2 || 0}
        />
      </section>
    </main>
  );
}
