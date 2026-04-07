import React from "react";
import Link from "next/link";
import { HeaderAuthButtons } from "./header-auth-buttons";
import { HeaderMobileMenu } from "./header-mobile-menu";

const navigationItems = [
  "Home",
  "Features",
  "Templates",
  "Pricing",
  "About",
  "Contact",
  "Blog",
  "Docs",
];

const Header: React.FC = () => {
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

    if (item === "Home") {
      return (
        <Link
          key={item}
          href={`/`}
          className="text-muted-foreground hover:text-primary cursor-pointer text-xs font-normal transition-colors"
        >
          {item}
        </Link>
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

  return (
    <header className="border-primary/10 sticky top-0 z-50 border-b bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
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

        {/* Desktop Auth Buttons (Client Component) */}
        <HeaderAuthButtons />

        {/* Mobile Menu (Client Component) */}
        <HeaderMobileMenu navigationItems={navigationItems} />
      </nav>
    </header>
  );
};

export default Header;
