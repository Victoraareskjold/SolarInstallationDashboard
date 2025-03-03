export default function DisplayInputField({ label, value }) {
  return (
    <div>
      <label className="block font-regular">{label}</label>
      <input
        type="number"
        value={value ?? 0}
        placeholder="0"
        readOnly
        className="border p-2 w-full"
      />
    </div>
  );
}
