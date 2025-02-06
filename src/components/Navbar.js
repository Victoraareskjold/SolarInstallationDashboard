import Link from "next/link";
import SignoutButton from "./SignoutButton";

export default function Navbar({ isHidden }) {
  return (
    <nav className="p-4 flex flex-row justify-between w-full">
      <Link href="/">Dashboard</Link>
      <ul className="flex flex-row gap-4">
        <ul>
          <li>
            <Link href="/estimates">Estimat</Link>
          </li>
        </ul>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <SignoutButton />
        </li>
      </ul>
    </nav>
  );
}
