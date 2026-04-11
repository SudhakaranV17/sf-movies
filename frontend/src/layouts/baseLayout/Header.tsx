import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import ThemeToggle from "@/shared/components/ThemeToggle";

interface HeaderProps {
  isOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ isOpen, onMenuToggle }: HeaderProps) {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const isFavorites = location.pathname.includes("favorites");

  const handleLogout = () => {
    confirmDialog({
      message: "Are you sure you want to sign out?",
      header: "Confirm Logout",
      icon: "pi pi-exclamation-triangle pr-2",
      acceptClassName: "p-button-danger",
      draggable: false,
      accept: () => {
        logout();
        navigate({ to: "/dashboard" });
      },
    });
  };

  return (
    <nav className="flex justify-between items-center bg-bg-raised px-3.5 py-[9px] border-border-strong border-b shrink-0">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-2">
        {/* Hamburger / close — mobile only */}
        <button
          onClick={onMenuToggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex justify-center items-center bg-transparent hover:bg-bg-overlay border-none rounded-[6px] w-8 h-8 transition-colors cursor-pointer"
        >
          <i className={`text-text-muted text-sm pi ${isOpen ? "pi-times" : "pi-bars"}`} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <div className="bg-accent rounded-full w-2 h-2 shrink-0" />
          <span className="font-medium text-text-primary text-sm">SF Movies</span>
        </div>
      </div>

      {/* Right: nav actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Favorites / Back to map */}
        {isFavorites ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 bg-transparent px-2.5 md:px-3 py-1.5 border border-border-strong rounded-[6px] text-text-muted hover:text-text-secondary text-xs no-underline transition-colors cursor-pointer"
          >
            <i className="text-[11px] pi pi-map" />
            <span className="hidden md:inline">Back to map</span>
          </Link>
        ) : (
          <Link
            to="/favorites"
            className="flex items-center gap-1.5 bg-transparent px-2.5 md:px-3 py-1.5 border border-border-strong rounded-[6px] text-text-muted hover:text-text-secondary text-xs no-underline transition-colors cursor-pointer"
          >
            <i className="text-[11px] pi pi-heart" />
            <span className="hidden md:inline">Favorites</span>
          </Link>
        )}

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-danger-dim/10 hover:bg-danger-dim/20 px-2.5 md:px-3 py-1.5 border border-danger/30 rounded-[6px] font-medium text-danger text-xs transition-colors cursor-pointer"
          >
            <i className="text-[11px] pi pi-sign-out" />
            <span className="hidden md:inline">Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 bg-accent hover:opacity-90 px-2.5 md:px-3 py-1.5 border-none rounded-[6px] font-medium text-white text-xs no-underline transition-opacity cursor-pointer"
          >
            <i className="text-[11px] pi pi-sign-in" />
            <span className="hidden md:inline">Login</span>
          </Link>
        )}
      </div>
      <ConfirmDialog />
    </nav>
  );
}