import { r as __toESM } from "../_runtime.mjs";
import { t as logo_default } from "./logo-tEwjuJxT.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Lock, J as EyeOff, M as Mail, P as LogIn, h as ShieldCheck, q as Eye, s as UserCog } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-BDsyb35P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const nav = useNavigate();
	const { signIn } = useAuth();
	const [loginType, setLoginType] = (0, import_react.useState)("admin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (!email.trim()) {
			toast.error("Please enter your email.");
			return;
		}
		if (!password) {
			toast.error("Please enter your password.");
			return;
		}
		setLoading(true);
		try {
			const user = await signIn(email.trim(), password, loginType);
			toast.success(`Welcome back, ${user.name}`);
			nav({ to: user.role === "super_admin" ? "/admin/accounts" : "/admin" });
		} catch (error) {
			console.error("LOGIN ERROR:", error);
			let message = "Invalid email or password.";
			if (error instanceof Error) message = error.message || message;
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden overflow-hidden gradient-hero lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-30",
				style: { backgroundImage: "radial-gradient(circle at 30% 30%, oklch(0.9 0.15 75) 0, transparent 40%)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col justify-between p-12 text-primary-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo_default,
								alt: "Afar UDCB logo",
								className: "h-10 w-10 object-contain"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display font-semibold",
							children: "Afar UDCB"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-primary-foreground/70",
							children: "Staff Portal"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-bold leading-tight",
						children: "Manage the Bureau's content with confidence."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-primary-foreground/80",
						children: "Publish news, manage tenders, coordinate directorate communications, and manage Bureau content from one place."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-primary-foreground/60",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Afar Regional State"
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-primary/5 ring-1 ring-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo_default,
								alt: "Afar UDCB logo",
								className: "h-10 w-10 object-contain"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold",
						children: "Staff Login"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Select your account type and login to the admin portal."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium",
							children: "Account type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-2 gap-2 rounded-xl border bg-muted/30 p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setLoginType("admin"),
								disabled: loading,
								className: `flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${loginType === "admin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }), "Admin"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setLoginType("super_admin"),
								disabled: loading,
								className: `flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${loginType === "super_admin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), "Super Admin"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
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
									autoComplete: "username",
									disabled: loading,
									className: "h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										placeholder: "Enter your password",
										autoComplete: "current-password",
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										disabled: loading,
										className: "h-11 w-full rounded-full border bg-background pl-10 pr-11 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword((value) => !value),
										disabled: loading,
										"aria-label": showPassword ? "Hide password" : "Show password",
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "inline-flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "rounded border",
											disabled: loading
										}), "Remember me"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/forgot-password",
										className: "text-primary hover:underline",
										children: "Forgot?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/register",
										className: "text-primary hover:underline",
										children: "Create account"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60",
								children: loading ? "Logging in..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Login", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" })] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-primary",
							children: "Back to public portal"
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
