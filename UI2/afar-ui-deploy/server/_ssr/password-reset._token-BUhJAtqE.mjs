import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { p as resetPassword } from "./authService-tLH6lGQn.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Lock, mt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./password-reset._token-aXgRBUzv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/password-reset._token-BUhJAtqE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const { token } = Route.useParams();
	const search = Route.useSearch();
	const [password, setPassword] = (0, import_react.useState)("");
	const [passwordConfirmation, setPasswordConfirmation] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
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
			navigate({ to: "/admin/login" });
		} catch (error) {
			console.error("Reset password error:", error);
			toast.error(error instanceof Error ? error.message : "Unable to reset password.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/login",
						className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to login"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-bold",
					children: "Reset Password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Enter your new password below."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-8 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium",
							children: "New Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Enter new password",
								disabled: loading,
								minLength: 8,
								className: "h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium",
							children: "Confirm Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								value: passwordConfirmation,
								onChange: (e) => setPasswordConfirmation(e.target.value),
								placeholder: "Confirm new password",
								disabled: loading,
								minLength: 8,
								className: "h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							className: "h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60",
							children: loading ? "Resetting..." : "Reset Password"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: "Password must contain at least 8 characters."
				})
			]
		})
	});
}
//#endregion
export { ResetPasswordPage as component };
