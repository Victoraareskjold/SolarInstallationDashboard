import Link from "next/link";

export default function NavbarItem({ route, name }) {
  return (
    <li className="w-full">
      <Link href={route || "/"}>{name || "No name set"}</Link>
    </li>
  );
}
