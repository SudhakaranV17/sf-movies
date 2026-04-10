import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function BaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-bg-page overflow-hidden">
      <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Body: sidebar + main — relative so the mobile drawer positions within it */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-hidden bg-bg-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
