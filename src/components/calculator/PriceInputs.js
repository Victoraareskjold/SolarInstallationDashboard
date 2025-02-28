export default function PriceInputs({
  data,
  roofTypes,
  roofFields,
  handleUpdate,
}) {
  return (
    <section className="mb-6">
      <h2 className="font-semibold text-lg">Taktyper</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Taktype</th>
            {roofFields.map((field) => (
              <th key={field} className="border p-2">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(roofTypes).map((taktype) => (
            <tr key={taktype} className="border">
              <td className="border p-2">{taktype}</td>
              {roofFields.map((key) => {
                let value = data[taktype]?.[key] ?? "";

                return (
                  <td key={key} className="border p-2">
                    <input
                      type="number"
                      value={value === 0 ? "" : value}
                      onChange={(e) =>
                        handleUpdate(taktype, key, Number(e.target.value))
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
    </section>
  );
}
