import React from "react";
import { useAuth, useClerk, useUser, UserButton } from "@clerk/react";

function AuthActionPanel() {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn, openSignUp, signOut } = useClerk();
  const { user } = useUser();

  return (
    <section className="flex w-full items-center justify-center bg-background/80 p-6 md:w-[44%] md:p-8">
      <div className="w-full max-w-md rounded-[26px] border border-border/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-[#111214]/80">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8E8E93]">Secure sign-in</p>
          <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm leading-6 text-[#636366] dark:text-[#98989D]">
            Sign in to continue your private conversations or create your account in seconds.
          </p>
        </div>

        {!isLoaded ? (
          <div className="text-sm text-[#8E8E93]">Preparing authentication…</div>
        ) : !isSignedIn ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openSignIn({ redirectUrl: "/" })}
              className="flex w-full items-center justify-center rounded-2xl bg-[#0A84FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A66FF]"
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
              <a href="/" className="inline-flex items-center text-sm font-semibold text-[#0A84FF] hover:underline">
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
