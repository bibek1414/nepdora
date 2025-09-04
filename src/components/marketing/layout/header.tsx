"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    "Features",
    "Templates",
    "Pricing",
    "About",
    "Contact",
  ];

  return (
    <header className="border-primary/10 sticky top-0 z-50 border-b bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" onClick={closeMenu}>
            <img
              src="/fulllogo.svg"
              alt="Nepdora Logo"
              className="h-8 cursor-pointer sm:h-10"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {navigationItems.map(item => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-muted-foreground hover:text-primary cursor-pointer font-medium transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/admin">
            <Button className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover: bg-gradient-to-r text-white transition-all duration-200">
              Admin Panel
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-muted-foreground hover:text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="border-primary/10 absolute top-full right-0 left-0 border-b bg-white/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            {/* Mobile Navigation Links */}
            <div className="mb-6 space-y-4">
              {navigationItems.map(item => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={closeMenu}
                  className="text-muted-foreground hover:text-primary block cursor-pointer font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3">
              <Link href="/login" onClick={closeMenu} className="block">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary w-full justify-start"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMenu} className="block">
                <Button className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover: w-full bg-gradient-to-r text-white transition-all duration-200">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
