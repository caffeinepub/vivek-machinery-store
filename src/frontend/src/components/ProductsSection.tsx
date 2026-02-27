import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PackageOpen, IndianRupee } from "lucide-react";
import { useListProducts, useListCategories } from "../hooks/useQueries";
import type { Product } from "../backend.d";
import ProductDetailModal from "./ProductDetailModal";
import InquiryFormModal from "./InquiryFormModal";

interface ProductsSectionProps {
  fullPage?: boolean;
}

export default function ProductsSection({ fullPage = false }: ProductsSectionProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading: productsLoading } = useListProducts();
  const { data: categories = [] } = useListCategories();

  const allCategories = ["All", ...categories];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const formatPrice = (paise: bigint) => {
    const rupees = Number(paise) / 100;
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(rupees);
  };

  return (
    <section className={`${fullPage ? "py-12" : "py-16 bg-secondary/50"} px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground mb-2">
            {fullPage ? "All Products" : "Our Products"}
          </h2>
          <p className="text-muted-foreground font-body">
            Browse our range of quality machinery and equipment
          </p>
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all border
                ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {["s1","s2","s3","s4","s5","s6","s7","s8"].map((key) => (
              <div key={key} className="bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PackageOpen className="h-16 w-16 mb-4 opacity-30" />
            <p className="font-display text-2xl font-semibold mb-1">No Products Found</p>
            <p className="font-body text-sm">Try a different search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                formatPrice={formatPrice}
                onView={() => setSelectedProduct(product)}
                onInquiry={() => setInquiryProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        formatPrice={formatPrice}
        onClose={() => setSelectedProduct(null)}
        onInquiry={(p) => {
          setSelectedProduct(null);
          setInquiryProduct(p);
        }}
      />

      {/* Inquiry Modal */}
      <InquiryFormModal
        product={inquiryProduct}
        onClose={() => setInquiryProduct(null)}
      />
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  formatPrice: (paise: bigint) => string;
  onView: () => void;
  onInquiry: () => void;
}

function ProductCard({ product, formatPrice, onView, onInquiry }: ProductCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-card card-hover group">
      {/* Image */}
      <button
        type="button"
        className="relative h-48 bg-secondary overflow-hidden cursor-pointer w-full block"
        onClick={onView}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/generated/vivek-logo-transparent.dim_300x300.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <PackageOpen className="h-16 w-16" />
          </div>
        )}
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={
              product.available
                ? "bg-green-600/90 text-white border-0 text-xs"
                : "bg-red-600/90 text-white border-0 text-xs"
            }
          >
            {product.available ? "Available" : "Out of Stock"}
          </Badge>
        </div>
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1">
          <Badge variant="secondary" className="text-xs font-body mb-2">
            {product.category}
          </Badge>
        </div>
        <button
          type="button"
          className="font-display text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-2 mb-2 text-left w-full"
          onClick={onView}
        >
          {product.name}
        </button>
        <div className="flex items-center gap-1 text-accent font-display text-xl font-bold mb-4">
          <IndianRupee className="h-4 w-4" />
          <span>{formatPrice(product.price)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 font-body text-xs border-border hover:border-primary hover:bg-primary/5"
            onClick={onView}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 font-body text-xs bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={onInquiry}
            disabled={!product.available}
          >
            Inquire
          </Button>
        </div>
      </div>
    </div>
  );
}
