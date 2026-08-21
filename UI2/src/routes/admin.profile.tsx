import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import { useAuth } from "@/lib/auth";
import { authFetch } from "@/services/authService";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "My Profile" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfileAdmin,
});

function ProfileAdmin() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  if (!user) {
    return null;
  }

  const roleLabel =
    user.role === "super_admin"
      ? "Super Administrator"
      : "Administrator";

  const permissionLabel =
    user.permissions.includes("*")
      ? "All permissions"
      : `${user.permissions.length} assigned permission${
          user.permissions.length === 1 ? "" : "s"
        }`;

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !password || !passwordConfirmation) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("The new password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("The new passwords do not match.");
      return;
    }

    if (currentPassword === password) {
      toast.error(
        "The new password must be different from the current password.",
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await authFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const validationMessage =
          body?.errors?.current_password?.[0] ??
          body?.errors?.password?.[0] ??
          body?.message;

        throw new Error(
          validationMessage || "Unable to change your password.",
        );
      }

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");

      toast.success(
        body?.message ?? "Password changed successfully.",
      );
    } catch (error) {
      console.error("Failed to change password:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to change your password.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="My Profile"
        description="View your account information and manage your password."
      />

      <div className="space-y-6">
        {/* Profile summary */}
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">
                {user.name || "Unnamed user"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {roleLabel}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-base font-semibold">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your current staff account details.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <User className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Full name
                </p>

                <p className="mt-1 break-words text-sm font-medium">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Email address
                </p>

                <p className="mt-1 break-words text-sm font-medium">
                  {user.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Account role
                </p>

                <p className="mt-1 text-sm font-medium">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Account status
                </p>

                <p className="mt-1 text-sm font-medium">
                  {user.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Change password */}
        <section className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />

              <h2 className="text-base font-semibold">
                Change Password
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your password using your current password.
              Your new password must contain at least 8 characters.
            </p>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="max-w-2xl space-y-5 p-6"
          >
            <PasswordField
              id="current-password"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
              disabled={changingPassword}
              autoComplete="current-password"
            />

            <PasswordField
              id="new-password"
              label="New password"
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
              disabled={changingPassword}
              autoComplete="new-password"
            />

            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              value={passwordConfirmation}
              onChange={setPasswordConfirmation}
              show={showConfirmation}
              onToggle={() =>
                setShowConfirmation((value) => !value)
              }
              disabled={changingPassword}
              autoComplete="new-password"
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPassword && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {changingPassword
                  ? "Changing password..."
                  : "Change Password"}
              </button>
            </div>
          </form>
        </section>

        {/* Permissions */}
        <section className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />

              <h2 className="text-base font-semibold">
                Permissions
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {permissionLabel}
            </p>
          </div>

          <div className="p-6">
            {user.permissions.includes("*") ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />

                  <p className="text-sm font-medium">
                    Full system access
                  </p>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  As a Super Administrator, you have access to all
                  administrative permissions.
                </p>
              </div>
            ) : user.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No permissions are currently assigned to this
                account.
              </p>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  disabled,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  disabled: boolean;
  autoComplete: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          minLength={id === "current-password" ? undefined : 8}
          className="w-full rounded-lg border bg-background px-3 py-2.5 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
