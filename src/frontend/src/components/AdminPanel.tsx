import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  InboxIcon,
  IndianRupee,
  KeyRound,
  Loader2,
  PackageOpen,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ProductInput } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetAllInquiries,
  useInitializeAdminAccess,
  useIsAdmin,
  useListCategories,
  useListProducts,
  useMarkInquiryResolved,
  useUpdateProduct,
} from "../hooks/useQueries";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  stock: string;
  available: boolean;
}

const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  stock: "0",
  available: true,
};

export default function AdminPanel() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  if (!identity) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShieldAlert className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-3xl font-bold mb-2 text-foreground">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground font-body text-center mb-6 max-w-sm">
          Please log in with your identity to access the admin panel.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoggingIn ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          Login
        </Button>
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminSetup />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-1">
          Admin Panel
        </h1>
        <p className="text-muted-foreground font-body">
          Manage products, categories and customer inquiries.
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6 bg-secondary/60">
          <TabsTrigger value="products" className="font-display font-semibold">
            Manage Products
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="font-display font-semibold">
            Inquiries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsManager />
        </TabsContent>

        <TabsContent value="inquiries">
          <InquiriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ——————————————————————————————————————————————
// Admin Setup (claim admin token)
// ——————————————————————————————————————————————

function AdminSetup() {
  const [token, setToken] = useState("");
  const initAdmin = useInitializeAdminAccess();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      toast.error("Please enter your admin secret token.");
      return;
    }
    try {
      await initAdmin.mutateAsync(token);
      toast.success("Admin access granted! Welcome.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("assigned")
      ) {
        toast.error(
          "Admin is already assigned to another account. Please use the account that first set up admin access.",
        );
      } else {
        toast.error(
          "Incorrect token. Make sure you are using the correct admin secret.",
        );
      }
    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2 text-center">
            Admin Login
          </h2>
          <p className="text-muted-foreground font-body text-center text-sm max-w-xs">
            Enter your admin secret token to claim or verify admin access for
            this store.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="admin-token"
              className="font-body font-medium text-sm"
            >
              Admin Secret Token
            </Label>
            <Input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your secret token"
              autoComplete="current-password"
              className="font-body"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            disabled={initAdmin.isPending}
          >
            {initAdmin.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4 mr-2" />
            )}
            {initAdmin.isPending ? "Verifying..." : "Login as Admin"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground font-body text-center mt-4">
          The admin secret token was set when this store was created.
        </p>
      </div>
    </div>
  );
}

// ——————————————————————————————————————————————
// Products Manager
// ——————————————————————————————————————————————

function ProductsManager() {
  const { data: products = [], isLoading } = useListProducts();
  const { data: categories = [] } = useListCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_PRODUCT_FORM);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditTarget(product);
    setForm({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock.toString(),
      available: product.available,
    });
    setFormOpen(true);
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      toast.error("Name and category are required.");
      return;
    }
    const priceInPaise = BigInt(
      Math.round(Number.parseFloat(form.price || "0") * 100),
    );
    const input: ProductInput = {
      name: form.name,
      description: form.description,
      price: priceInPaise,
      category: form.category,
      imageUrl: form.imageUrl,
      stock: BigInt(Number.parseInt(form.stock || "0")),
      available: form.available,
    };

    try {
      if (editTarget) {
        await updateProduct.mutateAsync({ id: editTarget.id, input });
        toast.success("Product updated successfully.");
      } else {
        await createProduct.mutateAsync(input);
        toast.success("Product created successfully.");
      }
      setFormOpen(false);
      setEditTarget(null);
      setForm(EMPTY_PRODUCT_FORM);
    } catch {
      toast.error("Failed to save product.");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted.");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete product.");
    }
  }

  const formatPrice = (paise: bigint) => {
    const rupees = Number(paise) / 100;
    return new Intl.NumberFormat("en-IN").format(rupees);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">
          Products ({products.length})
        </h2>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-body"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {["l1", "l2", "l3", "l4"].map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-muted-foreground">
          <PackageOpen className="h-14 w-14 mb-3 opacity-30" />
          <p className="font-display text-xl font-semibold">No products yet</p>
          <p className="font-body text-sm">
            Click "Add Product" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id.toString()}
              className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-xs"
            >
              {/* Thumbnail */}
              <div className="h-14 w-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/generated/vivek-logo-transparent.dim_300x300.png";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <PackageOpen className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-foreground truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-accent font-display font-bold text-sm flex items-center gap-0.5">
                    <IndianRupee className="h-3 w-3" />
                    {formatPrice(product.price)}
                  </span>
                  <Badge
                    className={
                      product.available
                        ? "bg-green-600/90 text-white border-0 text-xs"
                        : "bg-red-600/90 text-white border-0 text-xs"
                    }
                  >
                    {product.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 font-body text-xs"
                  onClick={() => openEdit(product)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 font-body text-xs border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive"
                  onClick={() => setDeleteConfirm(product.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">
              {editTarget ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="prod-name"
                className="font-body font-medium text-sm"
              >
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prod-name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="e.g. Industrial Drill Press"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="prod-desc"
                className="font-body font-medium text-sm"
              >
                Description
              </Label>
              <Textarea
                id="prod-desc"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Describe the product..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="prod-price"
                  className="font-body font-medium text-sm"
                >
                  Price (₹) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="prod-price"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="prod-stock"
                  className="font-body font-medium text-sm"
                >
                  Stock Quantity
                </Label>
                <Input
                  id="prod-stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleFormChange}
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="prod-category"
                className="font-body font-medium text-sm"
              >
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger id="prod-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  {categories.length === 0 && (
                    <SelectItem value="_none" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="prod-image"
                className="font-body font-medium text-sm"
              >
                Image URL
              </Label>
              <Input
                id="prod-image"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              {form.imageUrl && (
                <div className="h-24 w-24 mt-2 rounded-lg overflow-hidden bg-secondary border border-border">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="prod-available"
                checked={form.available}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    available: checked === true,
                  }))
                }
              />
              <Label
                htmlFor="prod-available"
                className="font-body text-sm cursor-pointer"
              >
                Available for inquiry
              </Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 font-body"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {createProduct.isPending || updateProduct.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {editTarget ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Delete Product?
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground mt-1">
            This action cannot be undone. The product will be permanently
            removed.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-body"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
              disabled={deleteProduct.isPending}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ——————————————————————————————————————————————
// Inquiries Manager
// ——————————————————————————————————————————————

function InquiriesManager() {
  const { data: inquiries = [], isLoading } = useGetAllInquiries();
  const markResolved = useMarkInquiryResolved();
  const { data: products = [] } = useListProducts();

  const productMap = new Map(products.map((p) => [p.id.toString(), p.name]));

  async function handleResolve(id: bigint) {
    try {
      await markResolved.mutateAsync(id);
      toast.success("Inquiry marked as resolved.");
    } catch {
      toast.error("Failed to update inquiry.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {["i1", "i2", "i3"].map((k) => (
          <Skeleton key={k} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-muted-foreground">
        <InboxIcon className="h-14 w-14 mb-3 opacity-30" />
        <p className="font-display text-xl font-semibold">No inquiries yet</p>
        <p className="font-body text-sm">
          Customer inquiries will appear here.
        </p>
      </div>
    );
  }

  const pending = inquiries.filter((i) => !i.resolved);
  const resolved = inquiries.filter((i) => i.resolved);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">
          Inquiries ({inquiries.length})
        </h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/15 text-primary border-0 font-body">
            {pending.length} Pending
          </Badge>
          <Badge variant="secondary" className="font-body">
            {resolved.length} Resolved
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {[...pending, ...resolved].map((inquiry) => (
          <div
            key={inquiry.id.toString()}
            className={`bg-card rounded-xl p-4 border shadow-xs transition-all ${
              inquiry.resolved
                ? "border-border opacity-60"
                : "border-primary/20"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display font-bold text-foreground">
                    {inquiry.name}
                  </p>
                  {inquiry.resolved ? (
                    <Badge
                      variant="secondary"
                      className="text-xs font-body gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </Badge>
                  ) : (
                    <Badge className="bg-accent/20 text-accent border-0 text-xs font-body">
                      Pending
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                  <p className="text-sm text-muted-foreground font-body">
                    ✉ {inquiry.email}
                  </p>
                  {inquiry.phone && (
                    <p className="text-sm text-muted-foreground font-body">
                      📞 {inquiry.phone}
                    </p>
                  )}
                  {inquiry.productId !== undefined && (
                    <p className="text-sm text-muted-foreground font-body">
                      📦{" "}
                      {productMap.get(inquiry.productId.toString()) ??
                        `Product #${inquiry.productId}`}
                    </p>
                  )}
                </div>

                <p className="text-sm text-foreground font-body leading-relaxed bg-secondary/50 rounded-lg p-3">
                  {inquiry.message}
                </p>
              </div>

              {!inquiry.resolved && (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5 font-body text-xs border-green-500/40 text-green-700 hover:bg-green-50 hover:border-green-500"
                  onClick={() => handleResolve(inquiry.id)}
                  disabled={markResolved.isPending}
                >
                  {markResolved.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Resolve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
