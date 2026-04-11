import { Link } from "@tanstack/react-router";
import AuthHeroPanel from "./components/AuthHeroPanel";
import AuthTabToggle from "./components/AuthTabToggle";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-bg-page">
      {/* Left: hero branding — hidden on mobile */}
      <AuthHeroPanel />

      {/* Right: form panel — full width on mobile, fixed width on md+ */}
      <div className="flex flex-1 md:flex-none md:w-[260px] lg:w-[280px] flex-col justify-center bg-bg-surface md:border-l md:border-border-strong p-5">
        {/* Mobile-only logo (hero panel is hidden on mobile) */}
        <div className="flex items-center gap-1.5 mb-6 md:hidden">
          <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className="text-text-primary text-sm font-medium">SF Movies</span>
        </div>

        {/* Panel header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-bg-overlay border border-border-strong flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary leading-tight">
              Welcome back
            </p>
            <p className="text-[10px] text-text-dim mt-0.5">
              Sign in to save favorites
            </p>
          </div>
        </div>

        {/* Login / Register tab toggle */}
        <AuthTabToggle activeTab="login" />

        {/* Login form */}
        <LoginForm />

        {/* Footer link */}
        <p className="text-center text-[10px] text-text-muted mt-3">
          No account?{" "}
          <Link
            to="/register"
            className="text-accent no-underline hover:opacity-80 transition-opacity"
          >
            Register free
          </Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-bg-page">
      {/* Left: hero branding — hidden on mobile */}
      <AuthHeroPanel />

      {/* Right: form panel — full width on mobile, fixed width on md+ */}
      <div className="flex flex-1 md:flex-none md:w-[260px] lg:w-[280px] flex-col justify-center bg-bg-surface md:border-l md:border-border-strong p-5">
        {/* Mobile-only logo */}
        <div className="flex items-center gap-1.5 mb-6 md:hidden">
          <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className="text-text-primary text-sm font-medium">SF Movies</span>
        </div>

        {/* Panel header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-bg-overlay border border-border-strong flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary leading-tight">
              Create account
            </p>
            <p className="text-[10px] text-text-dim mt-0.5">
              Save your favorite locations
            </p>
          </div>
        </div>

        {/* Login / Register tab toggle */}
        <AuthTabToggle activeTab="register" />

        {/* Register form */}
        <RegisterForm />

        {/* Footer link */}
        <p className="text-center text-[10px] text-text-muted mt-3">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent no-underline hover:opacity-80 transition-opacity"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
