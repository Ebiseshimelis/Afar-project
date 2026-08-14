import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, LogIn } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { login } from "@/services/authService";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Afar UDCB" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    console.log("LOGIN BUTTON WORKED");
    console.log("EMAIL:", email);

    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      console.log("LOGIN SUCCESS:", result);

      toast.success("Welcome back");

      nav({ to: "/admin" });
    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);

      let message = "Invalid email or password.";

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes("user") &&
          (errorMessage.includes("not found") ||
            errorMessage.includes("does not exist") ||
            errorMessage.includes("invalid"))
        ) {
          message = "Invalid username or email.";
        } else if (
          errorMessage.includes("password") ||
          errorMessage.includes("credential")
        ) {
          message = "Incorrect password.";
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("fetch") ||
          errorMessage.includes("failed to fetch")
        ) {
          message = "Unable to connect to the server.";
        } else if (error.message.trim()) {
          message = error.message;
        }
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side */}
      <div className="relative hidden overflow-hidden gradient-hero lg:block">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, oklch(0.9 0.15 75) 0, transparent 40%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
              <img
                src={logo}
                alt="Afar UDCB logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <div className="font-display font-semibold">Afar UDCB</div>
              <div className="text-xs text-primary-foreground/70">
                Admin Portal
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold leading-tight">
              Manage the Bureau&apos;s content with confidence.
            </h1>

            <p className="mt-3 max-w-md text-primary-foreground/80">
              Publish news, manage tenders, and coordinate directorate
              communications from one place.
            </p>
          </div>

          <div className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Afar Regional State
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-6 lg:hidden">
            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-primary/5 ring-1 ring-primary/10">
              <img
                src={logo}
                alt="Afar UDCB logo"
                className="h-10 w-10 object-contain"
              />
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold">Sign in</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Access the admin portal
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>

              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="username"
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>

              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2"
                />
              </div>
            </div>

            {/* Remember me / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border" />
                Remember me
              </label>

              <Link
                to="/admin/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign in
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to portal */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              ← Back to public portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}