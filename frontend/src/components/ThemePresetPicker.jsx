import { HERO_UI_THEME_PRESETS } from "../data/herouiThemePresets";
import { useTheme } from "../context/theme";

function ThemePresetPicker() {
  const { themePreset, setThemePreset } = useTheme();

  return (
    <label className="flex items-center rounded-xl border border-border/70 bg-background/70 px-2 text-xs font-semibold text-foreground transition hover:border-indigo-300">
      <span className="sr-only">Theme preset</span>
      <select
        value={themePreset}
        onChange={(event) => setThemePreset(event.target.value)}
        aria-label="Theme preset"
        className="max-w-[5rem] cursor-pointer bg-transparent py-2 text-foreground outline-none dark:bg-slate-900 dark:text-slate-100"
      >
        {HERO_UI_THEME_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ThemePresetPicker;
