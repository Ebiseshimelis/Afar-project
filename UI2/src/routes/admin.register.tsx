import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserCog,
  UserPlus,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const API_BASE = "http://127.0.0.1:8000/api/v1";

type RegistrationType = "admin" | "super_admin";

export const Route = createFileRoute("/admin/register")({
  component: AdminRegisterPage,
  head: () => ({
    meta: [{ title: "Create Staff Account — Afar UDCB" }],
  }),
});

function AdminRegisterPage() {
  const navigate = useNavigate();

  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("admin");

  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Ask the backend whether the first Super Admin still needs
   * to be created.
   */
  useEffect(() => {
    let cancelled = false;

    async function checkSetupStatus() {
      try {
        const response = await fetch(`${API_BASE}/staff-setup/status`, {
          headers: {
            Accept: "application/json",
          },
        });

        const body = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            body?.message || "Unable to check staff account setup.",
          );
        }

        if (!cancelled) {
          setSetupRequired(body?.setup_required === true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to connect to the server.",
          );
        }
      } finally {
        if (!cancelled) {
          setCheckingSetup(false);
        }
      }
    }

    checkSetupStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * When the backend tells us that a Super Admin already exists,
   * default the UI to normal Admin registration.
   *
   * The backend remains the final authority.
   */
  useEffect(() => {
    if (setupRequired === false && registrationType === "super_admin") {
      setRegistrationType("admin");
    }
  }, [setupRequired, registrationType]);

  function selectRegistrationType(type: RegistrationType) {
    setError("");
    setSuccess("");
    setRegistrationType(type);
  }

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

    /*
     * Extra UI guard for Super Admin registration.
     *
     * This is NOT the security mechanism. Laravel performs the
     * authoritative check again.
     */
    if (registrationType === "super_admin" && setupRequired === false) {
      setError(
        "A Super Admin account already exists. You cannot create another one.",
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        registrationType === "super_admin"
          ? "/staff-setup/super-admin"
          : "/staff-setup/admin";

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            body?.message ||
              "Super Admin setup has already been completed.",
          );
        }

        if (response.status === 422 && body?.errors) {
          const firstError = Object.values(body.errors)
            .flat()
            .find((value) => typeof value === "string");

          throw new Error(
            typeof firstError === "string"
              ? firstError
              : "Please check the information you entered.",
          );
        }

        throw new Error(
          body?.message || "Unable to create the account.",
        );
      }

      if (registrationType === "super_admin") {
        setSuccess(
          body?.message ||
            "Super Admin account created successfully. You can now log in.",
        );
      } else {
        setSuccess(
          body?.message ||
            "Admin account registration submitted successfully. Your account is waiting for Super Admin approval.",
        );
      }

      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");

      if (registrationType === "super_admin") {
        setSetupRequired(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the account.",
      );
    } finally {
      setLoading(false);
    }
  }

  const isSuperAdmin = registrationType === "super_admin";

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
              Create Staff Account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose the type of staff account you want to create.
            </p>
          </div>

          {/* Account type */}
          <div className="mb-6">
            <label className="block text-sm font-medium">
              Account type
            </label>

            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => selectRegistrationType("admin")}
                disabled={loading}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  registrationType === "admin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserCog className="h-4 w-4" />
                Admin
              </button>

              <button
                type="button"
                onClick={() => selectRegistrationType("super_admin")}
                disabled={loading || checkingSetup || setupRequired === false}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  registrationType === "super_admin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                } ${
                  setupRequired === false
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Super Admin
              </button>
            </div>

            {checkingSetup && (
              <p className="mt-2 text-xs text-muted-foreground">
                Checking Super Admin setup status...
              </p>
            )}

            {!checkingSetup && setupRequired === false && (
              <p className="mt-2 text-xs text-muted-foreground">
                A Super Admin account already exists. Additional Super Admin
                registrations are not allowed.
              </p>
            )}

            {!checkingSetup && setupRequired === true && (
              <p className="mt-2 text-xs text-muted-foreground">
                No Super Admin exists yet. The first Super Admin can be
                created here.
              </p>
            )}
          </div>

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
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
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
                    showConfirmation
                      ? "Hide password"
                      : "Show password"
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
              disabled={
                loading ||
                checkingSetup ||
                (isSuperAdmin && setupRequired === false)
              }
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Creating account..."
              ) : isSuperAdmin ? (
                <>
                  Create Super Admin Account
                  <ShieldCheck className="h-4 w-4" />
                </>
              ) : (
                <>
                  Create Admin Account
                  <UserPlus className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

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
            {isSuperAdmin ? (
              <>
                <strong className="text-foreground">
                  Super Admin:
                </strong>{" "}
                Only the first Super Admin can be created through this page.
                Once a Super Admin exists, additional Super Admin registration
                is blocked by the system.
              </>
            ) : (
              <>
                <strong className="text-foreground">
                  Admin:
                </strong>{" "}
                Your account will be created as pending. A Super Admin must
                approve the account and assign permissions before you can access
                the admin portal.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
