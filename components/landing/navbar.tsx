"use client";

import ModeToggle from "@/components/shared/header/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Products", href: "/products" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];
const NavBarLanding = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50  backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between mt-1 mb-4">
          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-2 group "
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="/images/naga-steel-depot.png"
              alt={`${APP_NAME} logo`}
              width={300}
              height={300}
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 200px, 300px"
              style={{ width: "100%", height: "auto" }}
              priority
              className="w-8 h-8 rounded  flex items-center justify-center"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("#") ? (
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-[#8899aa]  px-4 py-2 rounded transition-colors tracking-widest uppercase"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm text-[#8899aa]  px-4 py-2 rounded transition-colors tracking-widest uppercase"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            {/* <ModeToggle /> */}
          </ul>

          {/* CTA */}
          <button
            onClick={() => scrollTo("#contact")}
            className="hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded border border-[#EAC04D]/60 text-[#EAC04D]  transition-all tracking-widest"
          >
            <span className="text-[#EAC04D]/50"></span> Get a Quote
          </button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger className="align-middle">
                <Menu />
              </SheetTrigger>
              <SheetContent className="flex flex-col items-start p-6">
                <SheetTitle>Menu</SheetTitle>
                {/* <ModeToggle /> */}
                <ul className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("#") ? (
                        <button
                          onClick={() => scrollTo(link.href)}
                          className="font-mono text-sm text-[#8b9ab0]  transition-colors duration-200 cursor-pointer w-full text-left"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          className="font-mono text-sm text-[#8b9ab0]  transition-colors duration-200 block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollTo("#contact")}
                  className=" items-center gap-2 text-sm font-semibold px-4 py-2 rounded border border-[#EAC04D]/60 text-[#EAC04D]  transition-all tracking-widest"
                >
                  <span className="text-[#EAC04D]/50"></span> Get a Quote
                </button>
                <SheetDescription></SheetDescription>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavBarLanding;
