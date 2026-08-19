import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    const result = await login(email, password, remember);
    if (!result.ok) { setError(result.error ?? "Login failed."); return; }
    void navigate({ to: "/create-plan" });
  }

  return (
    <main className="min-h-screen gradient-soft flex items-center justify-center px-4 py-16">
      <div aria-hidden className="pointer-events-none fixed -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed -right-16 top-40 size-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-border bg-card/95 p-8 shadow-card backdrop-blur-sm sm:p-10">

          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-3 grid size-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
              <Leaf className="size-6" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">NutriFlex AI</span>
            <h1 className="mt-2 font-display text-2xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your AI-powered path to a healthier you.</p>
          </div>

          {/* Demo hint */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-primary">
            <span className="font-semibold">Demo account:</span> demo@nutriflex.ai / demo1234
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <span className="grid size-5 place-items-center text-primary"><Mail className="size-3.5" /></span>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={cn(
                  "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                  error ? "border-destructive" : "border-border",
                )}
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <span className="grid size-5 place-items-center text-primary"><Lock className="size-3.5" /></span>
                  Password
                </label>
                <Link to="/login" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                    "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                    error ? "border-destructive" : "border-border",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              Remember me
            </label>

            {/* Error */}
            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/8 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
              Sign In <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
