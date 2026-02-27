import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPage from "./components/AdminPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import type { Page } from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";

// Route /admin to the standalone AdminPage (no public header/footer)
const isAdminRoute = window.location.pathname === "/admin";

export default function App() {
  if (isAdminRoute) {
    return (
      <>
        <AdminPage />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return <PublicStore />;
}

function PublicStore() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {currentPage === "home" && (
          <>
            <HeroSection onBrowse={() => setCurrentPage("products")} />
            <ProductsSection />
          </>
        )}
        {currentPage === "products" && <ProductsSection fullPage />}
        {currentPage === "contact" && <ContactSection />}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <Toaster richColors position="top-right" />
    </div>
  );
}

function ContactSection() {
  return (
    <section className="py-16 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl font-bold text-foreground mb-3">
          Contact Us
        </h2>
        <p className="text-muted-foreground text-lg">
          Reach out for product inquiries, quotes, or general questions.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl p-6 border border-border shadow-card">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-2xl">📍</span>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Address</h3>
          <p className="text-muted-foreground text-sm">
            Vivek Machinery Store
            <br />
            Industrial Area, Main Market
            <br />
            India
          </p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-card">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <span className="text-2xl">📞</span>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Phone</h3>
          <p className="text-muted-foreground text-sm">
            +91 XXXXX XXXXX
            <br />
            Mon – Sat, 9am – 6pm
          </p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-card md:col-span-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-2xl">✉️</span>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Email</h3>
          <p className="text-muted-foreground text-sm">
            info@vivekmachinery.com
            <br />
            We reply within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
