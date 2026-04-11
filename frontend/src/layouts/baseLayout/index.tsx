import { type ReactNode, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface BaseLayoutProps {
  /** Pass children to replace the router Outlet (e.g. from a leaf route). */
  children?: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-bg-page overflow-hidden">
      <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

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