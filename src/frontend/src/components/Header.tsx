import { Menu, X } from "lucide-react";
import { useState } from "react";

export type Page = "home" | "products" | "contact";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Products", page: "products" },
    { label: "Contact Us", page: "contact" },
  ];

  function handleNav(page: Page) {
    onNavigate(page);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <img
              src="/assets/generated/vivek-logo-transparent.dim_300x300.png"
              alt="Vivek Machinery Store Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-xl font-bold text-white leading-tight">
              Vivek Machinery
              <br className="hidden xs:block" />
              <span className="text-orange-DEFAULT"> Store</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`
                  px-4 py-2 rounded-md font-body font-medium text-sm transition-all
                  ${
                    currentPage === link.page
                      ? "bg-accent text-accent-foreground"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`
                  w-full text-left px-4 py-2.5 rounded-md font-body font-medium text-sm transition-all
                  ${
                    currentPage === link.page
                      ? "bg-accent text-accent-foreground"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
