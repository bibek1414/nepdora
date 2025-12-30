"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth(); // make sure your hook exposes isLoading

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navigationItems = [
    "Features",
    "Templates",
    "Pricing",
    "About",
    "Contact",
    "Docs",
  ];

  if (isLoading) {
    // Show skeleton while loading
    return (
      <header className="border-primary/10 sticky top-0 z-50 border-b bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo Skeleton */}
          <Skeleton className="h-8 w-32 sm:h-10" />

          {/* Desktop Navigation Skeleton */}
          <div className="hidden space-x-8 md:flex">
            {navigationItems.map((_, index) => (
              <Skeleton key={index} className="h-5 w-20" />
            ))}
          </div>

          {/* Desktop Auth Buttons Skeleton */}
          <div className="hidden space-x-4 md:flex">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Mobile Menu Button Skeleton */}
          <Skeleton className="h-8 w-8 md:hidden" />
        </nav>
      </header>
    );
  }

  const renderNavigationItem = (item: string) => {
    if (item === "Docs") {
      return (
        <a
          key={item}
          href="https://docs.nepdora.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary cursor-pointer text-xs font-normal transition-colors"
        >
          {item}
        </a>
      );
    }

    return (
      <Link
        key={item}
        href={`/${item.toLowerCase()}`}
        className="text-muted-foreground hover:text-primary cursor-pointer text-xs font-normal transition-colors"
      >
        {item}
      </Link>
    );
  };

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
    <header className="border-primary/10 sticky top-0 z-50 border-b bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" onClick={closeMenu}>
            <img
              src="/nepdora-logooo.svg"
              alt="Nepdora Logo"
              className="h-6 cursor-pointer sm:h-6"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          {!isAuthenticated ? (
            <>
              <Link href="/admin/login">
                <Button variant="secondary" rounded={true}>
                  Sign In
                </Button>
              </Link>
              <Link href="/admin/signup">
                <Button variant="primary" rounded={true}>
                  Create Your Website for Free
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/admin">
              <Button className="bg-primary/80 rounded-full text-white transition-all duration-200">
                Admin Panel
              </Button>
            </Link>
          )}
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
              {navigationItems.map(item => renderMobileNavigationItem(item))}
            </div>

            {/* Mobile Auth Buttons */}
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
    </header>
  );
};

export default Header;
