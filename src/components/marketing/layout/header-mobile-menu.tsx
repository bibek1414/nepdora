"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface HeaderMobileMenuProps {
  navigationItems: string[];
}

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  navigationItems,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const renderMobileNavigationItem = (item: string) => {
    if (item === "Docs") {
      return (
        <a
          key={item}
          href="https://docs.nepdora.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          className="text-muted-foreground hover:text-primary block cursor-pointer font-medium transition-colors"
        >
          {item}
        </a>
      );
    }

    return (
      <Link
        key={item}
        href={`/${item.toLowerCase()}`}
        onClick={closeMenu}
        className="text-muted-foreground hover:text-primary block cursor-pointer font-medium transition-colors"
      >
        {item}
      </Link>
    );
  };

  return (
    <>
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

      {isMenuOpen && (
        <div className="border-primary/10 absolute top-full right-0 left-0 border-b bg-white/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="mb-6 space-y-4">
              {navigationItems.map(item => renderMobileNavigationItem(item))}
            </div>

            <div className="space-y-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/admin/login"
                    onClick={closeMenu}
                    className="block"
                  >
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary w-full justify-start"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/admin/signup"
                    onClick={closeMenu}
                    className="block"
                  >
                    <Button className="from-primary to-secondary hover:from-primary/90 w-full rounded-full">
                      Start Using the Nepdora Free
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/admin" onClick={closeMenu} className="block">
                  <Button className="w-full rounded-full text-white transition-all duration-200">
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
