import { WALLPAPERS } from "../data/wallpapers";
import { useWallpaper } from "../context/wallpaper";

function WallpaperPicker() {
  const { wallpaperId, setWallpaperId } = useWallpaper();

  return (
    <label className="sr-only">
      Conversation wallpaper
      <select value={wallpaperId} onChange={(event) => setWallpaperId(event.target.value)}>
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
