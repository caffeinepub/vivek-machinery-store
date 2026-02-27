import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

type Page = "home" | "products" | "contact" | "admin";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const isLoggedIn = !!identity;

  const navLinks: { label: string; page: Page; adminOnly?: boolean }[] = [
    { label: "Home", page: "home" },
    { label: "Products", page: "products" },
    { label: "Contact Us", page: "contact" },
    { label: "Admin", page: "admin", adminOnly: true },
  ];

  const visibleLinks = navLinks.filter((l) => !l.adminOnly || isAdmin);

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
              Vivek Machinery<br className="hidden xs:block" />
              <span className="text-orange-DEFAULT"> Store</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
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

          {/* Auth + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="hidden md:flex items-center gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <LogIn className="h-4 w-4" />
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1 animate-fade-in">
            {visibleLinks.map((link) => (
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
            <div className="pt-2 px-4">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
