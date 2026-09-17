import { t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categoryService-B-NfZuzo.js
var CATEGORY_API_URL = `${API_BASE}/categories`;
async function getCategories() {
	const response = await fetch(CATEGORY_API_URL, {
		method: "GET",
		headers: { Accept: "application/json" }
	});
	const text = await response.text();
	if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status} ${text}`);
	let result;
	try {
		result = JSON.parse(text);
	} catch {
		console.error("Categories returned invalid JSON:", text);
		throw new Error("Categories API returned invalid JSON");
	}
	console.log("Categories API response:", result);
	if (Array.isArray(result?.value)) return result.value;
	if (Array.isArray(result?.data)) return result.data;
	if (Array.isArray(result)) return result;
	console.error("Unexpected categories API response:", result);
	throw new Error("Invalid categories API response");
}
//#endregion
export { getCategories as t };
