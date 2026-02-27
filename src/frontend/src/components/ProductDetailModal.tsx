import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, PackageOpen, MessageSquare } from "lucide-react";
import type { Product } from "../backend.d";

interface ProductDetailModalProps {
  product: Product | null;
  formatPrice: (paise: bigint) => string;
  onClose: () => void;
  onInquiry: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  formatPrice,
  onClose,
  onInquiry,
}: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="h-56 md:h-full bg-secondary flex items-center justify-center min-h-[200px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/generated/vivek-logo-transparent.dim_300x300.png";
                }}
              />
            ) : (
              <PackageOpen className="h-20 w-20 text-muted-foreground/30" />
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs font-body">
                  {product.category}
                </Badge>
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
              <DialogTitle className="font-display text-2xl font-bold text-foreground leading-snug">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Price */}
            <div className="flex items-center gap-1 text-accent font-display text-3xl font-extrabold mb-4">
              <IndianRupee className="h-5 w-5" />
              <span>{formatPrice(product.price)}</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 flex-1">
                {product.description}
              </p>
            )}

            {/* Stock */}
            {product.stock > BigInt(0) && (
              <p className="text-sm text-muted-foreground mb-4 font-body">
                Stock available:{" "}
                <span className="font-semibold text-foreground">
                  {product.stock.toString()} units
                </span>
              </p>
            )}

            {/* Inquiry CTA */}
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display text-base font-semibold gap-2 mt-auto"
              onClick={() => onInquiry(product)}
              disabled={!product.available}
            >
              <MessageSquare className="h-4 w-4" />
              Send Inquiry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
