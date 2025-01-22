import Link from "next/link";
import SignoutButton from "./SignoutButton";

export default function Navbar() {
  return (
    <nav className="p-4 flex flex-row justify-between">
      <Link href="/dashboard">Dashboard</Link>
      <ul className="flex flex-row gap-4">
        <li>
          <SignoutButton />
        </li>
      </ul>
    </nav>
  );
}
