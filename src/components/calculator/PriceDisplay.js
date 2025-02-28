export default function PriceDisplay({
  data,
  allFields,
  setSelectedRoof,
  selectedRoof,
  snekkerDropdown,
  totals,
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Object.entries(allFields).map(([categoryKey, fields]) => (
        <div key={categoryKey}>
          <h2 className="font-semibold">{categoryKey}</h2>
          {fields.map((field) => {
            let value = data[categoryKey]?.[field] ?? 0;

            if (categoryKey === "snekker" && field === "Taktekke") {
              return (
                <div key={field} className="mb-2">
                  <label className="block font-regular">{field}</label>
                  <select
                    value={selectedRoof}
                    onChange={(e) => setSelectedRoof(e.target.value)}
                    className="border p-2 w-full"
                  >
                    {snekkerDropdown.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field === "Total") {
              return (
                <div key={field} className="mb-2">
                  <label className="block font-semibold">{field}</label>
                  <input
                    type="number"
                    value={totals[categoryKey] ?? 0}
                    placeholder={0}
                    readOnly
                    className="border p-2 w-full"
                  />
                </div>
              );
            }

            if (typeof value === "number") {
              return (
                <div key={field} className="mb-2">
                  <label className="block font-regular">{field}</label>
                  <input
                    type="number"
                    value={value === 0 ? "" : value}
                    placeholder={0}
                    min={0}
                    readOnly
                    className="border p-2 w-full"
                  />
                </div>
              );
            }

            if (typeof value === "string") {
              return (
                <div key={field} className="mb-2">
                  <label className="block font-regular">{field}</label>
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="border p-2 w-full"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      ))}
    </section>
  );
}
