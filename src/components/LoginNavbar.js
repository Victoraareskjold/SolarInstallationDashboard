import Link from "next/link";

export default function LoginNavbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}
