import Link from "next/link";
import { useState } from "react";
import DropdownItem from "./DropdownItem";
import * as LucideIcons from "lucide-react";

export default function DropdownMenu({
  route,
  route1,
  route2,
  route3,
  route4,
  route5,
  name,
  name1,
  name2,
  name3,
  name4,
  name5,
  icon,
  isNavbarOpen,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const IconComponent = LucideIcons[icon] || LucideIcons.CircleHelp;

  const handleMouseEnter = () => {
    //Denne gjør at navbar ikke åpner seg
    if (!isNavbarOpen) return;
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    //Denne gjør at navbar ikke åpner seg
    if (!isNavbarOpen) return;
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="flex flex-col gap-3 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      //onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <Link
        href={route || "/"}
        className={`flex items-center gap-3 w-full rounded-md`}
      >
        {" "}
        <IconComponent size={isNavbarOpen ? 20 : 24} />
        {(isNavbarOpen || isDropdownOpen) && (
          <p className="font-medium">{name || "No name set"}</p>
        )}
      </Link>
      {isDropdownOpen && (
        <ul>
          <DropdownItem route={route1} name={name1} />
          <DropdownItem route={route2} name={name2} />
          <DropdownItem route={route3} name={name3} />
          <DropdownItem route={route4} name={name4} />
          <DropdownItem route={route5} name={name5} />
        </ul>
      )}
    </div>
  );
}
