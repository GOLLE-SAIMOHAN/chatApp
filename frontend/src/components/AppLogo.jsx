export const APP_NAME = "ChatApp";

export function AppLogo({ size = 34, className = "", alt = "App logo" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#4338CA] via-[#6366F1] to-[#14B8A6] text-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      <span className="text-[0.8rem] font-bold tracking-[-0.08em]">CA</span>
    </div>
  );
}

export default AppLogo;
