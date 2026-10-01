import { useAuth, useClerk, useUser, UserButton } from "@clerk/react";

function AuthActionPanel() {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn, openSignUp, signOut } = useClerk();
  const { user } = useUser();

  return (
    <section className="flex w-full items-center justify-center bg-background/80 p-6 md:w-[44%] md:p-8">
      <div className="w-full max-w-md rounded-[26px] border border-indigo-100/80 bg-white/85 p-6 shadow-xl shadow-indigo-950/5 backdrop-blur dark:border-indigo-400/15 dark:bg-[#111827]/85">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8E8E93]">Secure sign-in</p>
          <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm leading-6 text-[#636366] dark:text-[#98989D]">
            Sign in to pick up where you left off, or create your personal ChatApp space in seconds.
          </p>
        </div>

        {!isLoaded ? (
          <div className="text-sm text-[#8E8E93]">Preparing authentication…</div>
        ) : !isSignedIn ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openSignIn({ redirectUrl: "/" })}
              className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-950/15 transition hover:from-indigo-700 hover:to-teal-600"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => openSignUp({ redirectUrl: "/" })}
              className="flex w-full items-center justify-center rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              Create account
            </button>
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-border/70 bg-black/5 p-4 dark:bg-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">You are signed in</p>
                <p className="text-sm text-[#636366] dark:text-[#98989D]">
                  {user?.fullName || "Pick up your chat thread from where you left off."}
                </p>
              </div>
              <UserButton afterSignOutUrl="/auth" />
            </div>
            <div className="flex items-center gap-3">
              <a href="/" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
                Open your inbox →
              </a>
              <button
                type="button"
                onClick={() => signOut({ redirectUrl: "/auth" })}
                className="text-sm font-semibold text-[#636366] hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AuthActionPanel;
