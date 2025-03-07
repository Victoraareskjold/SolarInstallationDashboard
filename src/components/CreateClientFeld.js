export default function CreateClientField({
  label,
  value,
  setSolarData,
  readOnly,
  field,
}) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        value={value == 0 ? 0 : value || ""}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={(e) =>
          setSolarData((prev) => ({
            ...prev,
            [field]: e.target.value,
          }))
        }
        placeholder={label}
        className="border p-2 w-full bg-white disabled:bg-slate-200"
      />
    </div>
  );
}
