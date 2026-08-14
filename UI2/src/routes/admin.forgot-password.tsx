import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { forgotPassword } from "@/services/authService";

export const Route = createFileRoute("/admin/forgot-password")({
  head: () => ({
    meta: [
      {
        title: "Forgot Password — Afar UDCB",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email.trim());

      setSent(true);

      toast.success(
        "Password reset link sent to your email."
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send password reset link."
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
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email address and we will send you
          a link to reset your password.
        </p>

        {sent ? (
          <div className="mt-8 rounded-lg border bg-card p-5">
            <p className="text-sm">
              If an account exists for{" "}
              <strong>{email}</strong>, a password
              reset link has been sent.
            </p>

            <Link
              to="/admin/login"
              className="mt-5 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium">
                Email
              </label>

              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}