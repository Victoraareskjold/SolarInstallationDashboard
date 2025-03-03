export default function PriceInputs({
  data,
  priceFields,
  priceCategories,
  handleUpdate,
}) {
  return (
    <section className="mb-6">
      {Object.keys(priceFields).map((category) => (
        <div key={category} className="mb-6">
          <h2 className="font-semibold text-lg">{category}</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Taktype</th>

                {priceCategories.map((field) => (
                  <th key={field} className="border p-2">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(priceFields[category]).map((taktype) => (
                <tr key={taktype} className="border">
                  <td className="border p-2 w-80">{taktype}</td>
                  {priceCategories.map((field) => {
                    let value = data[category]?.[taktype]?.[field] ?? "";

                    if (field === "Påslag i Kr") {
                      return (
                        <td key={field} className="border p-2">
                          <input
                            type="number"
                            // Snekker kostnad * 0.15
                            value={value}
                            min={0}
                            readOnly
                            className="border p-2 w-full"
                          />
                        </td>
                      );
                    }

                    // Total = snekker kostnad + påslag

                    // Total inkl. mva = total * 1.25

                    return (
                      <td key={field} className="border p-2">
                        <input
                          type="number"
                          value={value}
                          min={0}
                          onChange={(e) =>
                            handleUpdate(
                              category,
                              taktype,
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
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
