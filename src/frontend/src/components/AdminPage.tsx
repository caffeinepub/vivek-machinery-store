import { ArrowLeft, InboxIcon, PackageOpen, Settings } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllInquiries,
  useIsAdmin,
  useListProducts,
} from "../hooks/useQueries";
import AdminPanel from "./AdminPanel";

// ——————————————————————————————————————————————
// Dashboard Stats (shown only to authenticated admins)
// ——————————————————————————————————————————————

function DashboardStats() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: products = [], isLoading: productsLoading } = useListProducts();
  const { data: inquiries = [], isLoading: inquiriesLoading } =
    useGetAllInquiries();

  // Only show if user is authenticated and is admin
  if (!identity || !isAdmin) return null;

  const pendingCount = inquiries.filter((i) => !i.resolved).length;
  const resolvedCount = inquiries.filter((i) => i.resolved).length;

  const stats = [
    {
      label: "Total Products",
      value: productsLoading ? "—" : products.length.toString(),
      icon: <PackageOpen className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending Inquiries",
      value: inquiriesLoading ? "—" : pendingCount.toString(),
      icon: <InboxIcon className="h-5 w-5" />,
      color: "bg-orange-50 text-orange-700 border-orange-100",
      iconColor: "bg-orange-100 text-orange-600",
    },
    {
      label: "Resolved Inquiries",
      value: inquiriesLoading ? "—" : resolvedCount.toString(),
      icon: <Settings className="h-5 w-5" />,
      color: "bg-green-50 text-green-700 border-green-100",
      iconColor: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-4 rounded-xl border p-5 ${stat.color}`}
        >
          <div className={`rounded-lg p-2.5 shrink-0 ${stat.iconColor}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-display font-bold leading-tight">
              {stat.value}
            </p>
            <p className="text-sm font-body opacity-80 mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ——————————————————————————————————————————————
// Admin Page — Standalone, no public Header/Footer
// ——————————————————————————————————————————————

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full bg-navy shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/vivek-logo-transparent.dim_300x300.png"
                alt="Vivek Machinery Store Logo"
                className="h-9 w-9 object-contain"
              />
              <div className="leading-tight">
                <span className="font-display text-lg font-bold text-white block">
                  Vivek Machinery
                </span>
                <span className="font-body text-xs text-orange-DEFAULT font-semibold tracking-wide uppercase">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Back to Store */}
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-md font-body font-medium text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <DashboardStats />
        </div>
        <AdminPanel />
      </main>

      {/* Admin Footer */}
      <footer className="bg-navy text-white/50 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body">
          <p>
            © {new Date().getFullYear()} Vivek Machinery Store — Admin Panel
          </p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
