import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { useSubmitInquiry } from "../hooks/useQueries";
import type { Product } from "../backend.d";

interface InquiryFormModalProps {
  product: Product | null;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  product: "",
  message: "",
};

export default function InquiryFormModal({
  product,
  onClose,
}: InquiryFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const submitInquiry = useSubmitInquiry();

  useEffect(() => {
    if (product) {
      setForm((prev) => ({ ...prev, product: product.name }));
    }
  }, [product]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        productId: product?.id,
      });
      toast.success(
        "Inquiry submitted! We'll get back to you shortly."
      );
      setForm(EMPTY_FORM);
      onClose();
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">
            Send an Inquiry
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            {product
              ? `Inquiring about: ${product.name}`
              : "Fill in your details and we'll get back to you."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inquiry-name" className="font-body font-medium text-sm">
                Your Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="inquiry-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inquiry-phone" className="font-body font-medium text-sm">
                Phone
              </Label>
              <Input
                id="inquiry-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inquiry-email" className="font-body font-medium text-sm">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="inquiry-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              type="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inquiry-product" className="font-body font-medium text-sm">
              Product
            </Label>
            <Input
              id="inquiry-product"
              name="product"
              value={form.product}
              onChange={handleChange}
              placeholder="Product name or general inquiry"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inquiry-message" className="font-body font-medium text-sm">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="inquiry-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your requirements, quantity needed, or any questions..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-body"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-body gap-2"
              disabled={submitInquiry.isPending}
            >
              {submitInquiry.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
              {submitInquiry.isPending ? "Sending..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
