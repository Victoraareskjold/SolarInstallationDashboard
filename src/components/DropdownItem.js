import Link from "next/link";

export default function DropdownItem({ route, name }) {
  if (!route || !name) return null;

  return (
    <li className="w-full pl-2">
      <Link href={route || "/"}>{name || "No name set"}</Link>
    </li>
  );
}
