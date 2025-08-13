"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
      <div className="text-xl font-bold">Finance Tracker</div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link href="/" className={pathname === "/" ? "font-semibold" : ""}>Dashboard</Link>
            <Link href="/transactions" className={pathname === "/transactions" ? "font-semibold" : ""}>Transactions</Link>
            <Link href="/budgets" className={pathname === "/budgets" ? "font-semibold" : ""}>Budgets</Link>
            <Link href="/analytics" className={pathname === "/analytics" ? "font-semibold" : ""}>Analytics</Link>
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
