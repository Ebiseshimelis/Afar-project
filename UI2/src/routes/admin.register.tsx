import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserPlus,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { getSetupStatus, registerAdmin } from "@/services/staffSetupService";

const API_BASE = "http://127.0.0.1:8001/api/v1";

export const Route = createFileRoute("/admin/register")({
  component: AdminRegisterPage,
  head: () => ({
    meta: [{ title: "Create Admin Account — Afar UDCB" }],
  }),
});

function AdminRegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [registrationAllowed, setRegistrationAllowed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRegistrationStatus() {
      try {
        const status = await getSetupStatus();

        if (!mounted) return;

        setRegistrationAllowed(status.registration_allowed);
      } catch (err) {
        if (!mounted) return;

        setRegistrationAllowed(false);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to check whether Admin registration is available.",
        );
      } finally {
        if (mounted) {
          setCheckingStatus(false);
        }
      }
    }

    checkRegistrationStatus();

    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerAdmin(
        name,
        email,
        password,
        passwordConfirmation,
      );

      setSuccess(
        result.message ||
          "Admin account registration submitted successfully. Your account is waiting for Super Admin approval.",
      );

      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the Admin account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm">
                <img
                  src={logo}
                  alt="Afar UDCB logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold">
              Create Admin Account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Register for an Afar UDCB administrative account.
            </p>
          </div>

          {/* Registration status */}
          {checkingStatus && (
            <div className="mb-5 rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              Checking Admin registration availability...
            </div>
          )}

          {!checkingStatus && !registrationAllowed && !error && (
            <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-destructive">
              <p className="font-semibold">
                Admin registration is currently disabled.
              </p>
              <p className="mt-1">
                Please contact the Super Admin if you need an administrative
                account.
              </p>
            </div>
          )}

          {/* Status messages */}
          {error && (
            <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              <p>{success}</p>

              <button
                type="button"
                onClick={() => navigate({ to: "/admin/login" })}
                className="mt-2 font-semibold underline"
              >
                Return to Login
              </button>
            </div>
          )}

          {!checkingStatus && registrationAllowed && (
            <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">
                Full name
              </label>

              <div className="relative mt-1">
                <UserPlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  required
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email */}
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
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">
                Password
              </label>

              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-11 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium">
                Confirm password
              </label>

              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  required
                  type={showConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-11 w-full rounded-full border bg-background pl-10 pr-11 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmation((value) => !value)
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmation ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmation ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Admin Account
                  <UserPlus className="h-4 w-4" />
                </>
              )}
            </button>
            </form>
          )}

          {/* Login */}
          <div className="mt-6 text-center text-sm">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          {/* Account information */}
          <div className="mt-6 rounded-xl border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
            <strong className="text-foreground">Admin:</strong>{" "}
            Your account will be created as pending. A Super Admin must
            approve the account and assign permissions before you can access
            the admin portal.
          </div>
        </div>
      </div>
    </div>
  );
}
