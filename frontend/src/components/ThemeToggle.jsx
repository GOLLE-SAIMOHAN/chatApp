import { useTheme } from "../context/theme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-black/5 dark:hover:bg-white/10"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default ThemeToggle;
