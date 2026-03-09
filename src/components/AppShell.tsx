"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { motion } from "framer-motion";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  { href: "/leads", label: "Leads" },
  { href: "/offerter", label: "Offerter" },
  { href: "/idag", label: "Idag" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activePath = navItems.find((i) => pathname?.startsWith(i.href))?.href ?? "/leads";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur" style={{ zIndex: 60 }}>
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/leads" className="flex items-center">
            <Logo size="sm" />
          </Link>

          <Tabs value={activePath} className="hidden md:flex">
            <TabsList className="bg-muted/50">
              {navItems.map((item) => (
                <TabsTrigger
                  key={item.href}
                  value={item.href}
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="mx-auto w-full max-w-6xl px-4 py-10"
      >
        <div className="md:hidden">
          <div className="mb-6 rounded-lg bg-muted p-[3px]">
            <div className="grid grid-cols-3 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex h-8 items-center justify-center rounded-md text-sm font-medium transition-colors " +
                    (activePath === item.href
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {children}
      </motion.main>
    </div>
  );
}
