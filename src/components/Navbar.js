import Link from "next/link";
import SignoutButton from "./SignoutButton";
import DropdownMenu from "./DropdownMenu";
import NavbarItem from "./NavbarItem";

export default function Navbar() {
  return (
    <nav className="p-4 min-w-48 gap-8 flex flex-col h-full bg-white shadow-sm">
      <Link href="/">Dashboard</Link>

      <ul className="flex flex-col h-full gap-4">
        <DropdownMenu
          route="/clients"
          name="Clients"
          route1="/clients"
          name1="View all clients"
          route2="/clients/create"
          name2="Create new client"
        />
        <DropdownMenu route="/priceCalculator" name="Price Calculator" />
      </ul>

      <ul>
        <NavbarItem route="/profile" name="Profile" />
        <SignoutButton />
      </ul>
    </nav>
  );
}
