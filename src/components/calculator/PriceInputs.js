import {
  DeleteIcon,
  PlusCircle,
  PlusIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";

const getNumbers = (str) => {
  let matches = str.match(/(\d+)/);
  if (matches) {
    return matches[0];
  }
};

export default function PriceInputs({
  data,
  priceFields,
  categoryFields,
  handleUpdate,
  handleAddNewRow,
  handleDeleteRow,
  newCategoryName,
  setNewCategoryName,
}) {
  const handleCategoryNameChange = (category, value) => {
    setNewCategoryName((prevState) => ({
      ...prevState,
      [category]: value,
    }));
  };

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
          <table className="w-full border border-2 border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-start w-96">{category}</th>

                {categoryFields[category]?.map((field) => (
                  <th key={field} className="border p-2 text-start w-96">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data[category] &&
                Object.keys(data[category])
                  .sort((a, b) => {
                    const numA = getNumbers(a);
                    const numB = getNumbers(b);
                    return numA - numB;
                  })
                  .map((inputName) => (
                    <tr key={inputName} className="border">
                      <td className="p-2 w-full flex flex-col">
                        {inputName}
                        {category === "Ulike taktekker" && (
                          <select
                            className="input w-full"
                            value={
                              data[category]?.[inputName]?.selectedFeste || ""
                            }
                            onChange={(e) =>
                              handleUpdate(
                                inputName,
                                category,
                                "selectedFeste",
                                e.target.value
                              )
                            }
                          >
                            <option hidden disabled value="">
                              -- Velg feste --
                            </option>
                            {Object.keys(data["Festemateriell"]).map(
                              (festeKey) => (
                                <option key={festeKey} value={festeKey}>
                                  {festeKey}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      </td>

                      {categoryFields[category]?.map((field) => {
                        let value = data[category]?.[inputName]?.[field] ?? "";
                        let simpleValue = data[category]?.[inputName] ?? "";

                        // Ulike taktyper
                        const påslagIKr =
                          simpleValue?.["Snekker kostnad pr. panel"] *
                          simpleValue?.["Påslag elektriker %"];
                        const total =
                          simpleValue?.["Snekker kostnad pr. panel"] +
                          påslagIKr;

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
                            <td key={field} className="border p-2 w-64">
                              <input
                                type="number"
                                value={påslagIKr || påslagIKrElektriker || ""}
                                min={0}
                                placeholder="0"
                                readOnly
                                className="border p-2 w-full"
                              />
                            </td>
                          );
                        }
                        if (field === "Total eks. mva") {
                          return (
                            <td key={field} className="border p-2 w-64">
                              <input
                                type="number"
                                value={total || totalElektriker || ""}
                                min={0}
                                placeholder="0"
                                readOnly
                                className="border p-2 w-full"
                              />
                            </td>
                          );
                        }
                        if (field === "Total inkl. mva") {
                          return (
                            <td key={field} className="border p-2 w-64">
                              <input
                                type="number"
                                value={(total || totalElektriker) * 1.25 || ""}
                                min={0}
                                placeholder="0"
                                readOnly
                                className="border p-2 w-full"
                              />
                            </td>
                          );
                        }

                        // Ikke readonly felter
                        return (
                          <td key={field} className="border p-2 w-64">
                            <input
                              type="number"
                              value={value}
                              min={0}
                              placeholder="0"
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
                      <td className="text-center w-2 h-2">
                        <button
                          onClick={() => handleDeleteRow(category, inputName)}
                          className="text-red-500 hover:text-red-300 duration-200 p-4"
                        >
                          <Trash2Icon size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              <tr>
                <td className="p-2 flex flex-row gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-300 duration-200"
                    onClick={() =>
                      handleAddNewRow(category, newCategoryName[category] || "")
                    }
                    disabled={newCategoryName[category]?.trim() === ""}
                  >
                    <PlusCircle size={20} />
                  </button>
                  <input
                    className="border p-2 w-96"
                    value={newCategoryName[category] || ""}
                    placeholder="Add new category"
                    onChange={(e) =>
                      handleCategoryNameChange(category, e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
