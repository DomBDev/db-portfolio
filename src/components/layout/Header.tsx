"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200/10 bg-body/95 backdrop-blur supports-[backdrop-filter]:bg-body/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-brand-100 hover:text-brand-50 transition-colors">
          Dom
        </Link>
        
        <nav className="flex gap-1 sm:gap-2">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-surface-100 text-brand-100"
                    : "text-brand-200 hover:text-brand-100 hover:bg-surface-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
