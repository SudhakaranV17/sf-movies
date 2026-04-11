import { type ReactNode, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useFavorites } from "@/modules/favorites/hooks/favorites.hook";
import { useAuthStore } from "@/shared/store/useAuthStore";

interface BaseLayoutProps {
  /** Pass children to replace the router Outlet (e.g. from a leaf route). */
  children?: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Hoist favorites fetch here so the store is populated on every route,
  // not just the favorites page — this makes the drawer/panel button
  // reflect isFavorite correctly on /dashboard too.
  useFavorites({ enabled: isAuthenticated });

  return (
    <div className="h-screen flex flex-col bg-bg-page overflow-hidden">
      <Header
        isOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-hidden bg-bg-page flex flex-col">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}