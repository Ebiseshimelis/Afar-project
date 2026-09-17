import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { t as API_BASE } from "./_ssr/authService-tLH6lGQn.mjs";
import { E as Phone, M as Mail, j as MapPin, y as Send } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.contact-BCzNPpFu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API_BASE_URL = API_BASE;
async function sendContactMessage(data) {
	const response = await fetch(`${API_BASE_URL}/contact`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(data)
	});
	const result = await response.json();
	if (!response.ok) {
		const validationMessage = result?.message || "Failed to send your message.";
		throw new Error(validationMessage);
	}
}
function ContactPage() {
	const [sending, setSending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setSending(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		try {
			await sendContactMessage({
				full_name: String(formData.get("full_name") || ""),
				email: String(formData.get("email") || ""),
				phone: String(formData.get("phone") || ""),
				subject: String(formData.get("subject") || ""),
				message: String(formData.get("message") || "")
			});
			toast.success("Message sent — we'll get back to you shortly.");
			form.reset();
		} catch (error) {
			console.error("Failed to send contact message:", error);
			toast.error(error instanceof Error ? error.message : "Failed to send your message.");
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Get in touch",
		title: "Contact Us",
		description: "Reach directorates and city administrations, or send us a message."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "rounded-xl border bg-card p-6 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: "Send a message"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "We aim to respond within 3 working days."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							name: "full_name",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							name: "email",
							type: "email",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							name: "phone",
							type: "tel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subject",
								name: "subject",
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium",
								children: "Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "message",
								rows: 6,
								required: true,
								className: "mt-1 w-full rounded-lg border bg-background p-3 text-sm outline-none ring-ring focus:ring-2"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: sending,
					className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60",
					children: sending ? "Sending…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Send message ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })] })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5" }),
					title: "Phone",
					lines: ["033-666-0577", "033-666-0576"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" }),
					title: "Email",
					lines: ["info@afarudcb.gov.et"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" }),
					title: "Address",
					lines: [
						"Bureau HQ",
						"Semera, Afar Regional State",
						"Ethiopia"
					]
				})
			]
		})]
	})] });
}
function Field({ label, name, type = "text", required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "block text-sm font-medium",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		name,
		type,
		required,
		className: "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
	})] });
}
function InfoCard({ icon, title, lines }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-5 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground",
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display font-semibold",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-1 text-sm text-muted-foreground",
			children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: l }, l))
		})]
	});
}
//#endregion
export { ContactPage as component };
