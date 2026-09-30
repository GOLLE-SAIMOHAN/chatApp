import React from "react";

export const APP_NAME = "iMessageBot";

function AppLogo({ size = 34, className = "", alt = "App logo" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#7C4DFF] text-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      <span className="text-[0.8rem] font-semibold">IM</span>
    </div>
  );
}

export default AppLogo;
