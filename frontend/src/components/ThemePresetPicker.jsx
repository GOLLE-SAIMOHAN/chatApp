import { HERO_UI_THEME_PRESETS } from "../data/herouiThemePresets";
import { useTheme } from "../context/theme";

function ThemePresetPicker() {
  const { themePreset, setThemePreset } = useTheme();

  return (
    <label className="sr-only">
      Theme preset
      <select value={themePreset} onChange={(event) => setThemePreset(event.target.value)}>
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
