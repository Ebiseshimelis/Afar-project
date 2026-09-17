import { r as __toESM } from "../_runtime.mjs";
import { t as logo_default } from "./logo-tEwjuJxT.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as AuthError, t as API_BASE } from "./authService-tLH6lGQn.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Lock, J as EyeOff, M as Mail, mt as ArrowLeft, o as UserPlus, q as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.register-B6qzZ_ju.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function parseResponse(response) {
	const body = await response.json().catch(() => null);
	if (!response.ok) {
		const message = body?.message || body?.errors?.email?.[0] || body?.errors?.password?.[0] || body?.errors?.name?.[0] || "Unable to complete staff account setup.";
		throw new AuthError(String(message), response.status);
	}
	return body;
}
async function getSetupStatus() {
	let response;
	try {
		response = await fetch(`${API_BASE}/staff-setup/status`, {
			method: "GET",
			headers: { Accept: "application/json" }
		});
	} catch {
		throw new AuthError("Unable to connect to the server. Please make sure the Laravel API is running.", 0);
	}
	return parseResponse(response);
}
async function registerAdmin(name, email, password, passwordConfirmation) {
	let response;
	try {
		response = await fetch(`${API_BASE}/staff-setup/admin`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name,
				email,
				password,
				password_confirmation: passwordConfirmation
			})
		});
	} catch {
		throw new AuthError("Unable to connect to the server. Please make sure the Laravel API is running.", 0);
	}
	return parseResponse(response);
}
function AdminRegisterPage() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [passwordConfirmation, setPasswordConfirmation] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmation, setShowConfirmation] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [checkingStatus, setCheckingStatus] = (0, import_react.useState)(true);
	const [registrationAllowed, setRegistrationAllowed] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function checkRegistrationStatus() {
			try {
				const status = await getSetupStatus();
				if (!mounted) return;
				setRegistrationAllowed(status.registration_allowed);
			} catch (err) {
				if (!mounted) return;
				setRegistrationAllowed(false);
				setError(err instanceof Error ? err.message : "Unable to check whether Admin registration is available.");
			} finally {
				if (mounted) setCheckingStatus(false);
			}
		}
		checkRegistrationStatus();
		return () => {
			mounted = false;
		};
	}, []);
	async function onSubmit(event) {
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
			const result = await registerAdmin(name, email, password, passwordConfirmation);
			setSuccess(result.message || "Admin account registration submitted successfully. Your account is waiting for Super Admin approval.");
			setName("");
			setEmail("");
			setPassword("");
			setPasswordConfirmation("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to create the Admin account.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex min-h-screen max-w-md items-center px-6 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-5 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: logo_default,
										alt: "Afar UDCB logo",
										className: "h-12 w-12 object-contain"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold",
								children: "Create Admin Account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Register for an Afar UDCB administrative account."
							})
						]
					}),
					checkingStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-5 rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground",
						children: "Checking Admin registration availability..."
					}),
					!checkingStatus && !registrationAllowed && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Admin registration is currently disabled."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Please contact the Super Admin if you need an administrative account."
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
						children: error
					}),
					success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: success }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => navigate({ to: "/admin/login" }),
							className: "mt-2 font-semibold underline",
							children: "Return to Login"
						})]
					}),
					!checkingStatus && registrationAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "text",
									value: name,
									onChange: (event) => setName(event.target.value),
									placeholder: "Enter your full name",
									autoComplete: "name",
									disabled: loading,
									className: "h-11 w-full rounded-full border bg-background pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									value: email,
									onChange: (event) => setEmail(event.target.value),
									placeholder: "Enter your email",
									autoComplete: "email",
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
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (event) => setPassword(event.target.value),
										placeholder: "Create a password",
										autoComplete: "new-password",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium",
								children: "Confirm password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										type: showConfirmation ? "text" : "password",
										value: passwordConfirmation,
										onChange: (event) => setPasswordConfirmation(event.target.value),
										placeholder: "Confirm your password",
										autoComplete: "new-password",
										disabled: loading,
										className: "h-11 w-full rounded-full border bg-background pl-10 pr-11 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowConfirmation((value) => !value),
										disabled: loading,
										"aria-label": showConfirmation ? "Hide password" : "Show password",
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										children: showConfirmation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
								children: loading ? "Creating account..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Create Admin Account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" })] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-center text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/login",
							className: "inline-flex items-center gap-2 text-primary hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Login"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-xl border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: "Admin:"
							}),
							" ",
							"Your account will be created as pending. A Super Admin must approve the account and assign permissions before you can access the admin portal."
						]
					})
				]
			})
		})
	});
}
//#endregion
export { AdminRegisterPage as component };
