import { useThemeStore } from "@/shared/store/theme.store";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-[5px] bg-bg-overlay border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-raised cursor-pointer transition-all"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <i className="pi pi-moon text-sm" />
      ) : (
        <i className="pi pi-sun text-sm" />
      )}
    </button>
  );
}
