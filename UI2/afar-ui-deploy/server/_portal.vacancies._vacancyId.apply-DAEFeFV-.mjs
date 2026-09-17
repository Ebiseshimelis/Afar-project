import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { E as Phone, K as FileText, L as LoaderCircle, M as Mail, Q as CircleCheck, W as GraduationCap, i as User, it as Calendar, j as MapPin, mt as ArrowLeft, st as Briefcase, y as Send } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { i as getVacancy } from "./_ssr/vacancyService-Da2NxTO3.mjs";
import { t as Route } from "./_portal.vacancies._vacancyId.apply-Bhwk4shf.mjs";
import { a as submitJobApplication } from "./_ssr/jobApplicationService-DjOewgJ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.vacancies._vacancyId.apply-DAEFeFV-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(value) {
	if (!value) return "Not specified";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Not specified";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function VacancyApplicationPage() {
	const { vacancyId } = Route.useParams();
	const [vacancy, setVacancy] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [education, setEducation] = (0, import_react.useState)("");
	const [experience, setExperience] = (0, import_react.useState)("");
	const [coverLetter, setCoverLetter] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadVacancy() {
			try {
				setLoading(true);
				setError(null);
				const data = await getVacancy(vacancyId);
				if (!cancelled) setVacancy(data);
			} catch (err) {
				console.error("Failed to load vacancy:", err);
				if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load vacancy.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadVacancy();
		return () => {
			cancelled = true;
		};
	}, [vacancyId]);
	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		if (!file) {
			setError("Please upload your CV / Resume.");
			return;
		}
		setSubmitting(true);
		try {
			await submitJobApplication(vacancyId, {
				full_name: name.trim(),
				email: email.trim(),
				phone: phone.trim(),
				address: address.trim(),
				education: education.trim(),
				experience: experience.trim(),
				resume: file,
				cover_letter: coverLetter.trim()
			});
			setSubmitted(true);
		} catch (err) {
			console.error("Failed to submit job application:", err);
			setError(err instanceof Error ? err.message : "Failed to submit your application. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Apply for Vacancy",
		description: "Preparing your application..."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-4xl px-6 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-56 items-center justify-center rounded-2xl border bg-card shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), "Loading vacancy information..."]
			})
		})
	})] });
	if (!vacancy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Vacancy Not Found",
		description: "The requested vacancy could not be found."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-4xl px-6 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border bg-card p-10 text-center shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 font-display text-xl font-bold",
					children: "Vacancy unavailable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error || "This vacancy is no longer available."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/vacancies",
					className: "mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Vacancies"]
				})
			]
		})
	})] });
	const title = vacancy.title?.en || "Vacancy";
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Application Submitted",
		description: "Thank you for your interest in working with Afar UDCB."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-3xl px-6 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-3xl border bg-card shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 text-center sm:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-9 w-9 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 font-display text-2xl font-bold sm:text-3xl",
						children: "Thank you for applying"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground",
						children: [
							"Your application information has been received for the position of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: title
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "The recruitment team will review your application and contact you if further information is required."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vacancies/$vacancyId",
							params: { vacancyId: String(vacancy.id) },
							className: "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "View Vacancy"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vacancies",
							className: "inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90",
							children: "Browse Vacancies"
						})]
					})
				]
			})
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Apply for Vacancy",
		description: "Complete the application form below to apply for this employment opportunity."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/vacancies/$vacancyId",
				params: { vacancyId: String(vacancy.id) },
				className: "mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Vacancy Details"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-6 w-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-primary",
								children: "Position Applying For"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-2xl font-bold",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }),
										"Deadline:",
										" ",
										formatDate(vacancy.deadline)
									]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-3xl border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b p-6 sm:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "Applicant Information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted-foreground",
						children: "Please provide accurate information. The information you submit will be used for recruitment purposes."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary" }), "Full Name"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: name,
									onChange: (event) => setName(event.target.value),
									placeholder: "Enter your full name",
									className: "mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary" }), "Email Address"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									value: email,
									onChange: (event) => setEmail(event.target.value),
									placeholder: "you@example.com",
									className: "mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }), "Phone Number"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: phone,
									onChange: (event) => setPhone(event.target.value),
									placeholder: "+251 ...",
									className: "mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }), "Address"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										value: address,
										onChange: (event) => setAddress(event.target.value),
										placeholder: "Enter your current address",
										className: "mt-2 h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4 text-primary" }), "Education"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										value: education,
										onChange: (event) => setEducation(event.target.value),
										placeholder: "Enter your educational qualifications",
										rows: 3,
										className: "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-primary" }), "Experience"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										value: experience,
										onChange: (event) => setExperience(event.target.value),
										placeholder: "Describe your relevant work experience",
										rows: 4,
										className: "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), "CV / Resume"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										type: "file",
										accept: ".pdf,.doc,.docx",
										onChange: (event) => setFile(event.target.files?.[0] || null),
										className: "mt-2 block h-12 w-full rounded-xl border bg-background px-3 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "Accepted formats: PDF, DOC, DOCX."
									}),
									file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 flex items-center gap-2 text-xs font-medium text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), file.name]
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-semibold",
								children: "Cover Letter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								value: coverLetter,
								onChange: (event) => setCoverLetter(event.target.value),
								placeholder: "Tell us why you are interested in this position and why you would be a good candidate...",
								rows: 8,
								className: "mt-2 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-7 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/vacancies/$vacancyId",
								params: { vacancyId: String(vacancy.id) },
								className: "inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Cancel"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: submitting,
								className: "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
								children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Submitting..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "Submit Application"] })
							})]
						})
					]
				})]
			})
		]
	})] });
}
//#endregion
export { VacancyApplicationPage as component };
