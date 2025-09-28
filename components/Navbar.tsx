"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/supabase";

export default function Navbar() {
  const [name, setName] = useState("cook-shop");
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then((s:any) => {
      if (s.business_name) setName(s.business_name);
      if (s.logo_url) setLogo(s.logo_url);
    });
  }, []);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <nav className="container h-16 flex items-center justify-between">
        {/* Mobile: logo left */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <Image src={logo} alt="Logo" width={28} height={28} className="rounded-md" />
            ) : (
              <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700" />
            )}
            <span className="hidden md:inline font-semibold">{name}</span>
          </Link>
        </div>
        {/* Cart center on mobile */}
        <div className="md:hidden">
          <Link href="/cart" className="btn btn-ghost" aria-label="Cart">
            <ShoppingCart />
          </Link>
        </div>
        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-4">
            <Link className="nav-link" href="/">Store</Link>
            <Link className="nav-link" href="/cart">Cart</Link>
            <Link className="nav-link" href="/admin">Admin</Link>
          </div>
          <ThemeToggle />
          <button className="md:hidden btn btn-ghost" aria-label="Menu">
            <Menu />
          </button>
        </div>
      </nav>
    </header>
  );
}
