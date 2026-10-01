import AuthActionPanel from "../components/auth/AuthActionPanel";
import AuthHeader from "../components/auth/AuthHeader";
import AuthHeroPanel from "../components/auth/AuthHeroPanel";

function AuthPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(10,132,255,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#f2f5f9_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(10,132,255,0.2),_transparent_35%),linear-gradient(135deg,_#0b0b0d_0%,_#111214_100%)]">
      <AuthHeader />
      <main className="flex min-h-[calc(100vh-57px)] flex-col md:flex-row">
        <AuthHeroPanel />
        <AuthActionPanel />
      </main>
    </div>
  );
}

export default AuthPage;
