import { Heart } from "lucide-react";

type Page = "home" | "products" | "contact" | "admin";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-navy text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/vivek-logo-transparent.dim_300x300.png"
                alt="Vivek Machinery Store"
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-xl font-bold text-white">
                Vivek Machinery<br />
                <span className="text-accent">Store</span>
              </span>
            </div>
            <p className="font-body text-sm text-white/60 leading-relaxed">
              Quality machinery for industrial, agricultural and construction needs.
              Browse our catalog and send us an inquiry for pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", page: "home" as Page },
                { label: "Products", page: "products" as Page },
                { label: "Contact Us", page: "contact" as Page },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.page)}
                    className="font-body text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Contact
            </h3>
            <div className="space-y-2 font-body text-sm text-white/60">
              <p>📍 Industrial Area, Main Market, India</p>
              <p>📞 +91 XXXXX XXXXX</p>
              <p>✉ info@vivekmachinery.com</p>
              <p>🕐 Mon – Sat, 9am – 6pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            © 2026 Vivek Machinery Store. All rights reserved.
          </p>
          <p className="font-body text-xs text-white/40 flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-accent fill-current" /> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
