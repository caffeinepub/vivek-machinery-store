import { Button } from "@/components/ui/button";
import { ChevronRight, Settings, Truck, Wrench } from "lucide-react";

interface HeroSectionProps {
  onBrowse: () => void;
}

export default function HeroSection({ onBrowse }: HeroSectionProps) {
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative gear shapes */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[40px] border-white/5" />
      <div className="absolute -right-10 top-10 w-64 h-64 rounded-full border-[30px] border-white/5" />
      <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full border-[50px] border-white/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
            <Settings className="h-4 w-4 text-accent" />
            <span className="text-accent font-body text-sm font-medium">
              Trusted Machinery Supplier
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-none mb-4">
            Quality Machinery
            <br />
            <span className="text-accent">for Every Need</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-white/75 mb-10 max-w-xl leading-relaxed">
            Browse our wide range of industrial, agricultural and construction
            equipment. Send us an inquiry and we'll get back to you promptly.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={onBrowse}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-orange font-display text-lg font-semibold px-8 gap-2"
            >
              Browse Products
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm">
            {[
              {
                icon: <Wrench className="h-5 w-5" />,
                label: "Tools & Equipment",
              },
              { icon: <Truck className="h-5 w-5" />, label: "Fast Delivery" },
              {
                icon: <Settings className="h-5 w-5" />,
                label: "Genuine Parts",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center text-accent mb-2">
                  {item.icon}
                </div>
                <p className="text-white/60 text-xs font-body">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
