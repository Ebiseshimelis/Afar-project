import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { K as FileText, L as LoaderCircle, Y as Download, b as Search, q as Eye, t as X, u as Trash2 } from "../_libs/lucide-react.mjs";
import { i as getResumeUrl, n as getJobApplication, o as updateJobApplicationStatus, r as getJobApplications, t as deleteJobApplication } from "./jobApplicationService-DjOewgJ0.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.job-applications-DNPv5Z-2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
	"submitted",
	"reviewing",
	"shortlisted",
	"rejected",
	"hired"
];
function statusLabel(status) {
	switch (status) {
		case "submitted": return "Submitted";
		case "reviewing": return "Reviewing";
		case "shortlisted": return "Shortlisted";
		case "rejected": return "Rejected";
		case "hired": return "Hired";
		default: return status;
	}
}
function statusClass(status) {
	switch (status) {
		case "submitted": return "bg-blue-100 text-blue-700";
		case "reviewing": return "bg-yellow-100 text-yellow-700";
		case "shortlisted": return "bg-purple-100 text-purple-700";
		case "rejected": return "bg-red-100 text-red-700";
		case "hired": return "bg-green-100 text-green-700";
		default: return "bg-gray-100 text-gray-700";
	}
}
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString();
}
function getVacancyTitle(application) {
	return application.vacancy?.title?.en || application.vacancy?.title?.am || `Vacancy #${application.vacancy_id}`;
}
function JobApplicationsAdmin() {
	const { can } = useAuth();
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [selectedApplication, setSelectedApplication] = (0, import_react.useState)(null);
	const [detailsLoading, setDetailsLoading] = (0, import_react.useState)(false);
	const [updatingId, setUpdatingId] = (0, import_react.useState)(null);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	async function loadApplications() {
		try {
			setLoading(true);
			setError("");
			const result = await getJobApplications({
				status: statusFilter || void 0,
				email: search || void 0,
				perPage: 100
			});
			setApplications(result.data);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to load job applications.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadApplications();
	}, [statusFilter]);
	async function handleSearch(event) {
		event.preventDefault();
		await loadApplications();
	}
	async function openDetails(application) {
		try {
			setDetailsLoading(true);
			setError("");
			const fullApplication = await getJobApplication(application.id);
			setSelectedApplication(fullApplication);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to load application details.");
		} finally {
			setDetailsLoading(false);
		}
	}
	async function handleStatusChange(id, status) {
		try {
			setUpdatingId(id);
			setError("");
			const updated = await updateJobApplicationStatus(id, status);
			setApplications((current) => current.map((item) => item.id === id ? {
				...item,
				...updated
			} : item));
			if (selectedApplication?.id === id) setSelectedApplication(updated);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to update application status.");
		} finally {
			setUpdatingId(null);
		}
	}
	async function handleDelete(application) {
		if (!window.confirm(`Delete the application from ${application.full_name}? This cannot be undone.`)) return;
		try {
			setDeletingId(application.id);
			setError("");
			await deleteJobApplication(application.id);
			setApplications((current) => current.filter((item) => item.id !== application.id));
			if (selectedApplication?.id === application.id) setSelectedApplication(null);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to delete application.");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
					title: "Job Applications",
					description: "Review and manage applications submitted for vacancies."
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-white p-4 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSearch,
						className: "flex flex-col gap-3 md:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 18,
									className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: search,
									onChange: (event) => setSearch(event.target.value),
									placeholder: "Search by applicant email...",
									className: "w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: statusFilter,
								onChange: (event) => setStatusFilter(event.target.value),
								className: "rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All statuses"
								}), STATUS_OPTIONS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: status,
									children: statusLabel(status)
								}, status))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 17 }), "Search"]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-white shadow-sm",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center p-12 text-gray-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 24,
							className: "mr-2 animate-spin"
						}), "Loading applications..."]
					}) : applications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 text-center text-gray-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
								size: 42,
								className: "mx-auto mb-3 opacity-40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "No job applications found."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: "Applications submitted through the public vacancy portal will appear here."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[950px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b bg-gray-50 text-left text-sm text-gray-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Applicant"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Vacancy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Phone"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Submitted"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3 text-right",
										children: "Actions"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: applications.map((application) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b last:border-0 hover:bg-gray-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-gray-900",
											children: application.full_name
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "max-w-[220px] px-5 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm text-gray-700",
											children: getVacancyTitle(application)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-sm text-gray-600",
										children: application.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-sm text-gray-600",
										children: application.phone || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4",
										children: can("job_applications.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: application.status,
											disabled: updatingId === application.id,
											onChange: (event) => handleStatusChange(application.id, event.target.value),
											className: `rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${statusClass(application.status)}`,
											children: STATUS_OPTIONS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: status,
												children: statusLabel(status)
											}, status))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "whitespace-nowrap px-5 py-4 text-sm text-gray-600",
										children: formatDate(application.submitted_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-2",
											children: [can("job_applications.view") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => openDetails(application),
												className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-gray-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 }), "View"]
											}), can("job_applications.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: deletingId === application.id,
												onClick: () => handleDelete(application),
												className: "inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50",
												children: [deletingId === application.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
													size: 16,
													className: "animate-spin"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 }), "Delete"]
											})]
										})
									})
								]
							}, application.id)) })]
						})
					})
				})
			]
		}),
		detailsLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-white p-6 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					size: 28,
					className: "mx-auto animate-spin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-gray-600",
					children: "Loading application..."
				})]
			})
		}),
		selectedApplication && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-8 max-w-4xl rounded-2xl bg-white shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold text-gray-900",
							children: "Application Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-gray-500",
							children: ["Application #", selectedApplication.id]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedApplication(null),
							className: "rounded-lg p-2 hover:bg-gray-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 22 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500",
								children: "Applicant"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
										label: "Full Name",
										value: selectedApplication.full_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
										label: "Email",
										value: selectedApplication.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
										label: "Phone",
										value: selectedApplication.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
										label: "Address",
										value: selectedApplication.address
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500",
								children: "Vacancy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
								label: "Position",
								value: getVacancyTitle(selectedApplication)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500",
								children: "Education & Experience"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
									label: "Education",
									value: selectedApplication.education
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoItem, {
									label: "Experience",
									value: selectedApplication.experience
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500",
								children: "Cover Letter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm text-gray-700",
								children: selectedApplication.cover_letter || "No cover letter provided."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500",
								children: "Application Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [can("job_applications.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: selectedApplication.status,
									disabled: updatingId === selectedApplication.id,
									onChange: (event) => handleStatusChange(selectedApplication.id, event.target.value),
									className: `rounded-full border-0 px-4 py-2 text-sm font-medium ${statusClass(selectedApplication.status)}`,
									children: STATUS_OPTIONS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: status,
										children: statusLabel(status)
									}, status))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-gray-500",
									children: [
										"Submitted:",
										" ",
										formatDate(selectedApplication.submitted_at)
									]
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500",
								children: "Resume"
							}), (() => {
								const resumeUrl = getResumeUrl(selectedApplication.resume_path);
								if (!resumeUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-gray-500",
									children: "No resume attached."
								});
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: resumeUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 17 }), "View / Download Resume"]
								});
							})()] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end border-t p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedApplication(null),
							className: "rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50",
							children: "Close"
						})
					})
				]
			})
		})
	] });
}
function InfoItem({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs font-medium uppercase tracking-wide text-gray-500",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 whitespace-pre-wrap text-sm text-gray-900",
		children: value || "—"
	})] });
}
//#endregion
export { JobApplicationsAdmin as component };
