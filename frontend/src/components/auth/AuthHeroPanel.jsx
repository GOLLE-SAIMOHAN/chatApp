function AuthHeroPanel() {
  return (
    <section className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFC] to-[#CCFBF1] p-6 md:w-[56%] md:p-8 dark:from-[#1E1B4B]/60 dark:via-[#0F172A] dark:to-[#042F2E]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.65),_transparent_45%)]" />
      <div className="relative space-y-6">
        <div className="inline-flex w-fit items-center rounded-full border border-indigo-200/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-white/10 dark:text-indigo-200">
          Your conversations, your space
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Keep every important conversation within reach.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[#636366] dark:text-[#98989D]">
            ChatApp brings real-time messaging, flexible themes, and simple media sharing into one calm workspace.
          </p>
        </div>
      </div>

      <div className="relative mt-8 grid gap-3 rounded-[24px] border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur dark:bg-black/30 sm:grid-cols-3">
        {[
          { label: "Realtime", value: "Instant" },
          { label: "Security", value: "Private" },
          { label: "Experience", value: "Personal" },
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
