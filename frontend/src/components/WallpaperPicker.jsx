import { WALLPAPERS } from "../data/wallpapers";
import { useWallpaper } from "../context/wallpaper";

function WallpaperPicker() {
  const { wallpaperId, setWallpaperId } = useWallpaper();

  return (
    <label className="flex items-center rounded-xl border border-border/70 bg-background/70 px-2 text-xs font-semibold text-foreground transition hover:border-indigo-300">
      <span className="sr-only">Conversation wallpaper</span>
      <select
        value={wallpaperId}
        onChange={(event) => setWallpaperId(event.target.value)}
        aria-label="Conversation wallpaper"
        className="max-w-[5rem] cursor-pointer bg-transparent py-2 outline-none"
      >
        {WALLPAPERS.map((wallpaper) => (
          <option key={wallpaper.id} value={wallpaper.id}>
            {wallpaper.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default WallpaperPicker;
