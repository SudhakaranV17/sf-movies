import { Link } from "@tanstack/react-router";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <nav className="flex justify-between items-center bg-bg-raised px-3.5 py-[9px] border-border-strong border-b shrink-0">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          className="md:hidden flex justify-center items-center bg-transparent hover:bg-bg-overlay border-none rounded-[6px] w-8 h-8 transition-colors cursor-pointer"
        >
          <i className="text-text-muted text-sm pi pi-bars" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <div className="bg-accent rounded-full w-2 h-2 shrink-0" />
          <span className="font-medium text-text-primary text-sm">
            SF Movies
          </span>
        </div>
      </div>

      {/* Right: nav actions */}
      <div className="flex items-center gap-2">
        {/* Favorites — hidden on mobile */}
        <Link
          to="/favorites"
          className="hidden md:flex items-center gap-1.5 bg-transparent px-3 py-1.5 border border-border-strong rounded-[6px] text-text-muted hover:text-text-secondary text-xs no-underline transition-colors cursor-pointer"
        >
          <i className="text-[11px] pi pi-heart" />
          Favorites
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1.5 bg-accent hover:opacity-90 px-3 py-1.5 border-none rounded-[6px] font-medium text-bg-page text-xs transition-opacity cursor-pointer"
        >
          <i className="text-[11px] pi pi-sign-in" />
          Login
        </Link>
      </div>
    </nav>
  );
}
