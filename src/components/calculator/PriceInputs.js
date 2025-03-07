export default function PriceInputs({
  data,
  priceFields,
  categoryFields,
  handleUpdate,
  handleAddNewRow,
  newCategoryName,
  setNewCategoryName,
}) {
  return (
    <section className="mb-6">
      {Object.keys(priceFields).map((category) => (
        <div
          key={category}
          className={`${
            category == "Ulike taktekker" ||
            category == "Arbeid fra elektriker" ||
            category == "Tilleggsarbeid fra elektriker"
              ? "mb-6"
              : ""
          }`}
        >
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">{category}</th>

                {categoryFields[category]?.map((field) => (
                  <th key={field} className="border p-2">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data[category] &&
                Object.keys(data[category]).map((inputName) => (
                  <tr key={inputName} className="border">
                    <td className="p-2 w-80">{inputName}</td>

                    {categoryFields[category]?.map((field) => {
                      let value = data[category]?.[inputName]?.[field] ?? "";
                      let simpleValue = data[category]?.[inputName] ?? "";

                      // Ulike taktyper
                      const påslagIKr =
                        simpleValue?.["Snekker kostnad pr. panel"] *
                        simpleValue?.["Påslag elektriker %"];
                      const total =
                        simpleValue?.["Snekker kostnad pr. panel"] + påslagIKr;

                      // Arbeid fra elektriker

                      // Tilleggsarbeid fra elektriker
                      const påslagIKrElektriker =
                        simpleValue?.["Kostnad pr."] *
                        simpleValue?.["Påslag elektriker %"];
                      const totalElektriker =
                        simpleValue?.["Kostnad pr."] + påslagIKrElektriker;

                      // Readonly felter
                      if (field === "Påslag i Kr") {
                        return (
                          <td key={field} className="border p-2">
                            <input
                              type="number"
                              value={påslagIKr || påslagIKrElektriker || ""}
                              min={0}
                              readOnly
                              className="border p-2 w-full"
                            />
                          </td>
                        );
                      }
                      if (field === "Total eks. mva") {
                        return (
                          <td key={field} className="border p-2">
                            <input
                              type="number"
                              value={total || totalElektriker || ""}
                              min={0}
                              readOnly
                              className="border p-2 w-full"
                            />
                          </td>
                        );
                      }
                      if (field === "Total inkl. mva") {
                        return (
                          <td key={field} className="border p-2">
                            <input
                              type="number"
                              value={(total || totalElektriker) * 1.25 || ""}
                              min={0}
                              readOnly
                              className="border p-2 w-full"
                            />
                          </td>
                        );
                      }

                      // Ikke readonly felter
                      return (
                        <td key={field} className="border p-2">
                          <input
                            type="number"
                            value={value}
                            min={0}
                            onChange={(e) =>
                              handleUpdate(
                                inputName,
                                category,
                                field,
                                Number(e.target.value)
                              )
                            }
                            className="border p-2 w-full"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              <tr>
                <td className="p-2 flex flex-row gap-2">
                  <input
                    className="border p-2 w-full"
                    value={newCategoryName || ""}
                    placeholder="Add new category"
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button
                    className=""
                    onClick={() => handleAddNewRow(category, newCategoryName)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
