import Link from "next/link";
import * as LucideIcons from "lucide-react";

export default function NavbarItem({ route, name, icon, isNavbarOpen }) {
  const IconComponent = LucideIcons[icon] || LucideIcons.CircleHelp;

  return (
    <Link href={route || "/"} className="flex gap-3 items-center w-full">
      <IconComponent size={20} />
      {isNavbarOpen && <p className="font-medium">{name || "No name set"}</p>}
    </Link>
  );
}
