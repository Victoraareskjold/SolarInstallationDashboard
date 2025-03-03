import DisplayInputField from "./DisplayInputField";

export default function PriceDisplay({
  data,
  allFields,
  priceFields,
  setSelectedRoof,
  selectedRoof,
  totals,
  panelCount,
}) {
  // Hent data for valgt taktekke og elektriker
  const selectedRoofData = data["Ulike taktekker"]?.[selectedRoof] || {};
  const selectedElectricianData = data["Arbeid fra elektriker"] || {};

  // Snekker
  const snekkerKostnad = selectedRoofData["Snekker kostnad pr. panel"];
  const snekkerTotal = panelCount * snekkerKostnad;
  // legg til påslag elektriker
  const påslagElektriker = selectedRoofData["Påslag elektriker"];
  const påslagIKr = selectedRoofData["Påslag i Kr"];
  const snekkerTotalTotal = snekkerTotal + påslagIKr;

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
          value={selectedRoofData["Snekker kostnad pr. panel"]}
        />
        <DisplayInputField
          label={"Snekker total kostnad"}
          value={snekkerTotal || 0}
        />
        <DisplayInputField
          label={"Påslag elektriker"}
          value={selectedRoofData["Påslag elektriker"]}
        />
        <DisplayInputField
          label={"Påslag i Kr"}
          value={selectedRoofData["Påslag i Kr"]}
        />
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
          label={"Tilleggskostnader"}
          value={selectedElectricianData["Tilleggskostnader"]}
        />
        <DisplayInputField
          label={"Påslag elektriker"}
          value={selectedElectricianData["Påslag elektriker %"]}
        />
        <DisplayInputField
          label={"Total"}
          value={selectedElectricianData["Total"]}
        />
      </section>
    </main>
  );
}
