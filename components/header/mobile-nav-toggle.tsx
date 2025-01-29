"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavToggleProps {
  className?: string;
  items: Array<{ name: string; href: string }>;
}

export function MobileNavToggle({ className, items }: MobileNavToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(className)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[65px] z-50 border-b bg-background duration-300 animate-in slide-in-from-top-5 md:hidden"
        >
          <Container className="py-4">
            <nav className="flex flex-col space-y-4">
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm transition-colors hover:text-foreground/80"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-2" />
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </>
  );
}
