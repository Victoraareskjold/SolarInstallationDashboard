export default function NumberInput({
  label,
  value,
  onChange,
  readOnly = false,
}) {
  return (
    <div className="price-input">
      <p>{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        readOnly={readOnly}
      />
    </div>
  );
}
