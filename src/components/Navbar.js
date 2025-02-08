import Link from "next/link";
import SignoutButton from "./SignoutButton";
import { useState } from "react";

export default function Navbar({ isHidden }) {
  const [isEstimateDropdownOpen, setIsEstimateDropdownOpen] = useState(false);

  return (
    <nav className="p-4 flex flex-row justify-between w-full bg-white shadow-sm">
      <Link href="/">Dashboard</Link>
      <ul className="flex flex-row gap-4">
        <li className="relative">
          <button
            onClick={() => setIsEstimateDropdownOpen(!isEstimateDropdownOpen)}
          >
            Estimater &gt;
          </button>
          {isEstimateDropdownOpen && (
            <ul className="absolute top-full right-full bg-white shadow-sm p-4 rounded-xl min-w-64">
              <li>
                <Link href="/estimates">Se alle</Link>
              </li>
              <li>
                <Link href="/estimates/create">Oprett estimat</Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/email">Email</Link>
        </li>
        <li>
          <SignoutButton />
        </li>
      </ul>
    </nav>
  );
}
