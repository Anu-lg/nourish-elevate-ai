import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Eye, EyeOff, ArrowRight, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())          e["name"]     = "Full name is required.";
    if (!email.trim())         e["email"]    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e["email"] = "Enter a valid email.";
    if (!password)             e["password"] = "Password is required.";
    else if (password.length < 8) e["password"] = "Password must be at least 8 characters.";
    if (password !== confirm)  e["confirm"]  = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.ok) { setErrors({ email: result.error ?? "Registration failed." }); return; }
    setSuccess(true);
    setTimeout(() => void navigate({ to: "/login" }), 1500);
  }

  return (
    <main className="min-h-screen gradient-soft flex items-center justify-center px-4 py-16">
      <div aria-hidden className="pointer-events-none fixed -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed -right-16 top-40 size-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card/95 p-8 shadow-card backdrop-blur-sm sm:p-10">

          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-3 grid size-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
              <Leaf className="size-6" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">NutriFlex AI</span>
            <h1 className="mt-2 font-display text-2xl font-semibold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Start your personalized health journey today.</p>
          </div>

          {/* Success banner */}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              🎉 Account created! Redirecting to login…
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <span className="grid size-5 place-items-center text-primary"><User className="size-3.5" /></span>
                Full Name
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                className={cn(
                  "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                  errors["name"] ? "border-destructive" : "border-border",
                )}
              />
              {errors["name"] && <p className="mt-1 text-xs text-destructive">{errors["name"]}</p>}
            </div>

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
                  errors["email"] ? "border-destructive" : "border-border",
                )}
              />
              {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <span className="grid size-5 place-items-center text-primary"><Lock className="size-3.5" /></span>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                    "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                    errors["password"] ? "border-destructive" : "border-border",
                  )}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide" : "Show"}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors["password"] && <p className="mt-1 text-xs text-destructive">{errors["password"]}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <span className="grid size-5 place-items-center text-primary"><Lock className="size-3.5" /></span>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showCf ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                    "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                    errors["confirm"] ? "border-destructive" : "border-border",
                  )}
                />
                <button type="button" onClick={() => setShowCf(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showCf ? "Hide" : "Show"}>
                  {showCf ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors["confirm"] && <p className="mt-1 text-xs text-destructive">{errors["confirm"]}</p>}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={loading || success}>
              {loading ? (
                <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg> Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="size-4" /></>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
