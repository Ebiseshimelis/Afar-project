import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as authFetch } from "./authService-tLH6lGQn.mjs";
import { B as KeyRound, J as EyeOff, L as LoaderCircle, M as Mail, Q as CircleCheck, h as ShieldCheck, i as User, q as Eye } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.profile-B2w9pvpQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfileAdmin() {
	const { user } = useAuth();
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [passwordConfirmation, setPasswordConfirmation] = (0, import_react.useState)("");
	const [showCurrent, setShowCurrent] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmation, setShowConfirmation] = (0, import_react.useState)(false);
	const [changingPassword, setChangingPassword] = (0, import_react.useState)(false);
	if (!user) return null;
	const roleLabel = user.role === "super_admin" ? "Super Administrator" : user.role_name || "Administrator";
	const permissionLabel = user.permissions.includes("*") ? "All permissions" : `${user.permissions.length} assigned permission${user.permissions.length === 1 ? "" : "s"}`;
	async function handleChangePassword(event) {
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
			toast.error("The new password must be different from the current password.");
			return;
		}
		try {
			setChangingPassword(true);
			const response = await authFetch("/auth/change-password", {
				method: "POST",
				body: JSON.stringify({
					current_password: currentPassword,
					password,
					password_confirmation: passwordConfirmation
				})
			});
			const body = await response.json().catch(() => null);
			if (!response.ok) {
				const validationMessage = body?.errors?.current_password?.[0] ?? body?.errors?.password?.[0] ?? body?.message;
				throw new Error(validationMessage || "Unable to change your password.");
			}
			setCurrentPassword("");
			setPassword("");
			setPasswordConfirmation("");
			toast.success(body?.message ?? "Password changed successfully.");
		} catch (error) {
			console.error("Failed to change password:", error);
			toast.error(error instanceof Error ? error.message : "Unable to change your password.");
		} finally {
			setChangingPassword(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "My Profile",
		description: "View your account information and manage your password."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl border bg-card p-6 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground",
						children: user.name.charAt(0).toUpperCase() || "U"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate text-xl font-semibold",
								children: user.name || "Unnamed user"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: user.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), roleLabel]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), user.is_active ? "Active" : "Inactive"]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Account Information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Your current staff account details."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 p-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-secondary p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 break-words text-sm font-medium",
									children: user.name || "Not provided"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-secondary p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Email address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 break-words text-sm font-medium",
									children: user.email || "Not provided"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-secondary p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Account role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: roleLabel
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-secondary p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Account status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: user.is_active ? "Active" : "Inactive"
							})] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Change Password"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Update your password using your current password. Your new password must contain at least 8 characters."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleChangePassword,
					className: "max-w-2xl space-y-5 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
							id: "current-password",
							label: "Current password",
							value: currentPassword,
							onChange: setCurrentPassword,
							show: showCurrent,
							onToggle: () => setShowCurrent((value) => !value),
							disabled: changingPassword,
							autoComplete: "current-password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
							id: "new-password",
							label: "New password",
							value: password,
							onChange: setPassword,
							show: showPassword,
							onToggle: () => setShowPassword((value) => !value),
							disabled: changingPassword,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
							id: "confirm-password",
							label: "Confirm new password",
							value: passwordConfirmation,
							onChange: setPasswordConfirmation,
							show: showConfirmation,
							onToggle: () => setShowConfirmation((value) => !value),
							disabled: changingPassword,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: changingPassword,
								className: "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
								children: [changingPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), changingPassword ? "Changing password..." : "Change Password"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Permissions"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: permissionLabel
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6",
					children: user.permissions.includes("*") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-primary/20 bg-primary/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Full system access"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "As a Super Administrator, you have access to all administrative permissions."
						})]
					}) : user.permissions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: user.permissions.map((permission) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-secondary px-3 py-1.5 text-xs font-medium",
							children: permission
						}, permission))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No permissions are currently assigned to this account."
					})
				})]
			})
		]
	})] });
}
function PasswordField({ id, label, value, onChange, show, onToggle, disabled, autoComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "mb-1.5 block text-sm font-medium",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: show ? "text" : "password",
			value,
			onChange: (event) => onChange(event.target.value),
			disabled,
			autoComplete,
			minLength: id === "current-password" ? void 0 : 8,
			className: "w-full rounded-lg border bg-background px-3 py-2.5 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onToggle,
			disabled,
			"aria-label": show ? "Hide password" : "Show password",
			className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50",
			children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
		})]
	})] });
}
//#endregion
export { ProfileAdmin as component };
