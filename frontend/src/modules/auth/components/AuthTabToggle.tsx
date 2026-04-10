// Segmented tab control that switches between /login and /register routes.
// Active tab is determined by the parent page — no local state needed.

import { Link } from "@tanstack/react-router";

interface AuthTabToggleProps {
  activeTab: "login" | "register";
}

export default function AuthTabToggle({ activeTab }: AuthTabToggleProps) {
  return (
    <div className="flex bg-bg-page border border-border-default rounded-[6px] p-0.5 mb-3">
      <Link
        to="/login"
        className={`flex-1 text-center text-xs py-[5px] rounded-[5px] no-underline transition-colors ${
          activeTab === "login"
            ? "bg-bg-overlay text-text-primary"
            : "text-text-dim hover:text-text-muted"
        }`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`flex-1 text-center text-xs py-[5px] rounded-[5px] no-underline transition-colors ${
          activeTab === "register"
            ? "bg-bg-overlay text-text-primary"
            : "text-text-dim hover:text-text-muted"
        }`}
      >
        Register
      </Link>
    </div>
  );
}
