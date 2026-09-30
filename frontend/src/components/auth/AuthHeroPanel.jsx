import React from "react";

function AuthHeroPanel() {
  return (
    <section className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0A84FF]/10 via-transparent to-[#7C4DFF]/10 p-6 md:w-[56%] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.65),_transparent_45%)]" />
      <div className="relative space-y-6">
        <div className="inline-flex w-fit items-center rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#0A84FF] shadow-sm backdrop-blur dark:bg-black/30">
          Private chat experience
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Stay connected with a polished, personal inbox.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[#636366] dark:text-[#98989D]">
            A modern, elegant messaging app with custom wallpapers, theme presets, and secure sign-in.
          </p>
        </div>
      </div>

      <div className="relative mt-8 grid gap-3 rounded-[24px] border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur dark:bg-black/30 sm:grid-cols-3">
        {[
          { label: "Realtime", value: "Instant" },
          { label: "Security", value: "Protected" },
          { label: "Design", value: "Aesthetic" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-background/70 p-3 text-center">
            <p className="text-lg font-semibold text-foreground">{item.value}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8E8E93]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuthHeroPanel;
