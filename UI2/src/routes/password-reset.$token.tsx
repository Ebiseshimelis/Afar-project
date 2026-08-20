import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/services/authService";

export const Route = createFileRoute("/password-reset/$token")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: String(search.email ?? ""),
  }),

  head: () => ({
    meta: [
      {
        title: "Reset Password — Afar UDCB",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  const { token } = Route.useParams();
  const search = Route.useSearch();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!search.email) {
      toast.error("Invalid password reset link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, search.email, password, passwordConfirmation);

      toast.success("Password reset successfully.");

      navigate({
        to: "/admin/login",
      });
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>

        <h1 className="font-display text-2xl font-bold">
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium">
              New Password
            </label>

            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                minLength={8}
                className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                required
                type="password"
                value={passwordConfirmation}
                onChange={(e) =>
                  setPasswordConfirmation(e.target.value)
                }
                placeholder="Confirm new password"
                disabled={loading}
                minLength={8}
                className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Password must contain at least 8 characters.
        </p>
      </div>
    </div>
  );
}
