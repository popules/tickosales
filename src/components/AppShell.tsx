import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/leads", label: "Leads" },
  { href: "/offerter", label: "Offerter" },
  { href: "/idag", label: "Idag" },
];

export default function AppShell({
  children,
  activePath,
}: {
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-950 dark:from-zinc-950 dark:to-black dark:text-zinc-50">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/leads" className="font-semibold tracking-tight">
            Ticko
            <span className="text-zinc-500 dark:text-zinc-400">.se</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors " +
                    (isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
