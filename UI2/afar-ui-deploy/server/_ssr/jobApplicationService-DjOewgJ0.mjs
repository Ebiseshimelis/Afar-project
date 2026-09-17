import { l as getToken, n as API_ORIGIN, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobApplicationService-DjOewgJ0.js
var API_BASE_URL = API_BASE;
function getAuthHeaders() {
	const token = getToken();
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
async function parseResponse(response) {
	const text = await response.text();
	console.log("========== JOB APPLICATION API RESPONSE ==========");
	console.log("Status:", response.status);
	console.log("Response:", text);
	console.log("===================================================");
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = null;
	}
	if (!response.ok) {
		let message = data?.message || data?.error || text || `API request failed: ${response.status}`;
		if (data?.errors) {
			const errors = Object.values(data.errors).flat().join(" ");
			if (errors) message = errors;
		}
		throw new Error(`${message} (HTTP ${response.status})`);
	}
	return data;
}
async function submitJobApplication(vacancyId, data) {
	const formData = new FormData();
	formData.append("full_name", data.full_name);
	formData.append("email", data.email);
	if (data.phone?.trim()) formData.append("phone", data.phone.trim());
	if (data.address?.trim()) formData.append("address", data.address.trim());
	if (data.education?.trim()) formData.append("education", data.education.trim());
	if (data.experience?.trim()) formData.append("experience", data.experience.trim());
	if (data.cover_letter?.trim()) formData.append("cover_letter", data.cover_letter.trim());
	formData.append("resume", data.resume);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/vacancies/${vacancyId}/applications`, {
		method: "POST",
		headers: { Accept: "application/json" },
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid application submission response.");
	return result.data;
}
async function getJobApplications(params) {
	const searchParams = new URLSearchParams();
	if (params?.vacancyId) searchParams.set("vacancy_id", String(params.vacancyId));
	if (params?.status) searchParams.set("status", params.status);
	if (params?.email?.trim()) searchParams.set("email", params.email.trim());
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.perPage) searchParams.set("per_page", String(params.perPage));
	const query = searchParams.toString();
	const result = await parseResponse(await fetch(`${API_BASE_URL}/job-applications${query ? `?${query}` : ""}`, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	return {
		current_page: result?.current_page ?? 1,
		data: Array.isArray(result?.data) ? result.data : [],
		last_page: result?.last_page ?? 1,
		per_page: result?.per_page ?? 20,
		total: result?.total ?? 0
	};
}
async function getJobApplication(id) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/job-applications/${id}`, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	if (!result?.data) throw new Error("Invalid job application response.");
	return result.data;
}
async function updateJobApplicationStatus(id, status) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/job-applications/${id}`, {
		method: "PUT",
		headers: {
			...getAuthHeaders(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ status })
	}));
	if (!result?.data) throw new Error("Invalid update application response.");
	return result.data;
}
async function deleteJobApplication(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/job-applications/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
function getResumeUrl(resumePath) {
	if (!resumePath) return null;
	if (resumePath.startsWith("http://")) return resumePath;
	if (resumePath.startsWith("https://")) return resumePath;
	return `${API_ORIGIN}/storage/${resumePath}`;
}
//#endregion
export { submitJobApplication as a, getResumeUrl as i, getJobApplication as n, updateJobApplicationStatus as o, getJobApplications as r, deleteJobApplication as t };
