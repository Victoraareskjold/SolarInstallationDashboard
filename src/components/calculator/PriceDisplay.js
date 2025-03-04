import DisplayInputField from "./DisplayInputField";

export default function PriceDisplay({
  data,
  priceFields,
  selectedRoof,
  setSelectedRoof,
  selectedExtras,
  setSelectedExtras,
  panelCount,
}) {
  // Hent data for valgt taktekke og elektriker
  const selectedRoofData = data["Ulike taktekker"]?.[selectedRoof] || {};
  const selectedElectricianData = data["Arbeid fra elektriker"] || {};
  const selectedElectricianExtraData =
    data["Arbeid fra elektriker"]?.[selectedDropdown1] || {};

  // Snekker
  const snekkerKostnad = selectedRoofData["Snekker kostnad pr. panel"];
  const snekkerTotal = panelCount * snekkerKostnad;
  const påslagElektriker = selectedRoofData["Påslag elektriker %"];
  const påslagIKr = snekkerTotal * påslagElektriker;
  const snekkerTotalTotal = snekkerTotal + påslagIKr;

  // Elektriker

  // Elektriker tilleggskostnader
  const kostnadPrTillegg = selectedElectricianExtraData["Kostnad pr."] || 0;
  const påslagProsent =
    selectedElectricianExtraData["Påslag elektriker %"] || 0;
  const påslagIKrElektriker = kostnadPrTillegg * påslagProsent;
  const totalPerEnhet = kostnadPrTillegg + påslagIKrElektriker;
  const totalTillegg = kostnadPrTillegg;
  //const totalTillegg = selectedDropdown1Count * totalPerEnhet;
  const totalExtrasCost = selectedExtras.reduce((sum, extra) => {
    const extraCost = extra.count * (extra.cost + extra.cost * extra.markup);
    return sum + extraCost;
  }, 0);

  // Generell kode
  const handleExtraChange = (index, key, value) => {
    const newExtras = [...selectedExtras];
    newExtras[index][key] = value;

    if (key === "type") {
      const extraData = data["Tilleggsarbeid fra elektriker"]?.[value] || {};
      newExtras[index].cost = extraData["Kostnad pr."] || 0;
      newExtras[index].markup = extraData["Påslag elektriker %"] || 0;
    }

    setSelectedExtras(newExtras);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
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
            {Object.keys(priceFields["Ulike taktekker"]).map((roofName) => (
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
          label={"Elektriker arbeid"}
          value={selectedElectricianData["Elektriker arbeid"]}
        />
        <DisplayInputField
          label={"Stillase* (gjelder for en side)"}
          value={selectedElectricianData["Stillase* (gjelder for en side)"]}
        />
        <DisplayInputField
          label={"Påslag elektriker %"}
          value={selectedElectricianData["Påslag elektriker %"]}
        />
        <DisplayInputField
          label={"Total eks. mva"}
          value={selectedElectricianData["Total eks. mva"]}
        />
      </section>

      {/* Leverandør Nordic Solergy */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Leverandør Nordic Solergy</h2>

        <DisplayInputField label={"Panel kostnad"} value={""} />
        <DisplayInputField label={"Feste kostnad"} value={""} />
        <DisplayInputField label={"Invertert Kostnad"} value={""} />
        <DisplayInputField label={"Batteri kostnad"} value={""} />
        <DisplayInputField label={"Påslag elektriker %"} value={""} />
        <DisplayInputField label={"Total eks. mva"} value={""} />
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
                  handleExtraChange(index, "type", e.target.value)
                }
                className="w-full bg-transparent"
              >
                <option value="" disabled hidden>
                  -- Legg til tilleggskostnad --
                </option>
                {Object.keys(priceFields["Tilleggsarbeid fra elektriker"])
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
                  handleExtraChange(index, "count", Number(e.target.value))
                }
                disabled={!extra.type}
                className="border p-2 w-full"
              />
            </div>
          );
        })}
        <DisplayInputField
          label="Påslag elektriker %"
          value={totalExtrasCost}
        />
        <DisplayInputField label="Total eks. mva" value={totalExtrasCost} />
      </section>

      {/* Total kostnad */}
      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Total kostnad</h2>

        <DisplayInputField label={"Leverandør andel"} value={""} />
        <DisplayInputField label={"Elektro andel + snekker"} value={""} />
        <DisplayInputField label={"Soleklart andel"} value={""} />
        <DisplayInputField label={"Frakt"} value={""} />
        <DisplayInputField label={"Total SUM eks. mva"} value={""} />
        <DisplayInputField label={"Total SUM inkl. mva"} value={""} />
        <DisplayInputField label={"Enova støtte"} value={""} />
        <DisplayInputField label={"Sluttkostnad"} value={""} />
      </section>
    </main>
  );
}
