import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { s as forgotPassword } from "./authService-tLH6lGQn.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Mail, mt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.forgot-password-DElaCS04.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPasswordPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!email.trim()) {
			toast.error("Please enter your email address.");
			return;
		}
		try {
			setLoading(true);
			await forgotPassword(email.trim());
			setSent(true);
			toast.success("Password reset link sent to your email.");
		} catch (error) {
			console.error("Forgot password error:", error);
			toast.error(error instanceof Error ? error.message : "Unable to send password reset link.");
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
					children: "Forgot Password?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Enter your email address and we will send you a link to reset your password."
				}),
				sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-lg border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"If an account exists for",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: email }),
							", a password reset link has been sent."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/login",
						className: "mt-5 inline-flex text-sm font-medium text-primary hover:underline",
						children: "Return to login"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-8 space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm font-medium",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "Enter your email",
							disabled: loading,
							className: "h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60",
						children: loading ? "Sending..." : "Send Reset Link"
					})]
				})
			]
		})
	});
}
//#endregion
export { ForgotPasswordPage as component };
