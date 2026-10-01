import { useTheme } from "../context/theme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-950/40"
    >
      {theme === "dark" ? "☼ Light" : "◐ Dark"}
    </button>
  );
}

export default ThemeToggle;
