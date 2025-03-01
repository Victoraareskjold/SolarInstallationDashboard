import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import NavbarItem from "./NavbarItem";
import { useState } from "react";

import { HomeIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

export default function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const handleToggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <nav
      style={{
        alignItems: isNavbarOpen ? "flex-start" : "center",
        width: isNavbarOpen ? "100%" : "fit-content",
        textWrap: "nowrap",
      }}
      className="p-3 gap-8 flex flex-col h-full bg-white shadow-sm max-w-48"
    >
      <Link href="/" className="flex flex-row gap-3 w-full items-center">
        <HomeIcon color="black" size={20} />
        {isNavbarOpen && <p className="font-medium text-lg">Dashboard</p>}
      </Link>

      <ul className="flex flex-col h-full gap-4 w-full">
        <DropdownMenu
          route="/clients"
          name="Clients"
          route1="/clients"
          name1="View all clients"
          route2="/clients/create"
          name2="Create new client"
          icon="Filter"
          isNavbarOpen={isNavbarOpen}
        />
        <DropdownMenu
          route="/priceCalculator"
          name="Price Calculator"
          icon="Calculator"
          isNavbarOpen={isNavbarOpen}
        />
      </ul>

      <ul className="flex flex-col gap-2 w-full">
        <NavbarItem
          route="/profile"
          name="Profile"
          icon="User"
          isNavbarOpen={isNavbarOpen}
        />
        <button
          onClick={handleToggleNavbar}
          className="flex gap-3 items-center w-full"
        >
          {isNavbarOpen ? (
            <PanelLeftOpenIcon size={20} />
          ) : (
            <PanelLeftCloseIcon size={20} />
          )}
          {isNavbarOpen ? <p className="font-medium">Toggle menu</p> : ""}
        </button>
      </ul>
    </nav>
  );
}
