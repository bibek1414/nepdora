"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="border-primary/10 sticky top-0 z-50 border-b bg-white/80 px-6 py-4 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <img
              src="/fulllogo.svg"
              alt="Nepdora Logo"
              className="h-10 cursor-pointer"
            />
          </Link>
        </div>

        <div className="hidden items-center space-x-8 md:flex">
          {["Features", "Templates", "Pricing", "About", "Contact"].map(
            item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary cursor-pointer font-medium transition-colors"
              >
                {item}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 bg-gradient-to-r text-white shadow-lg transition-all duration-200 hover:shadow-xl">
              Get Started Free
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
