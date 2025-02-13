import Link from "next/link";
import { useState } from "react";
import DropdownItem from "./DropdownItem";

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
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  return (
    <div
      className="w-full flex flex-col gap-2 duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      //onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <Link href={route || "/"}>{name || "No name set"}</Link>
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
