import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { H as Image } from "./_libs/lucide-react.mjs";
import { i as getMultimedia } from "./_ssr/multimediaService-KsWseGkg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.multimedia.images.index-CsIYuVnn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImageGalleryPage() {
	const [images, setImages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadImages() {
			try {
				setLoading(true);
				setError(null);
				const data = await getMultimedia();
				setImages(data.filter((item) => item.type === "image" && item.status === "published"));
			} catch (err) {
				console.error("Failed to load images:", err);
				setError("Unable to load images.");
			} finally {
				setLoading(false);
			}
		}
		loadImages();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold",
				children: "Image Gallery"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Browse photos and image collections."
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-10 text-center text-muted-foreground",
				children: "Loading images..."
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-10 text-center text-destructive",
				children: error
			}),
			!loading && !error && images.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border bg-card p-10 text-center shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto mb-4 h-10 w-10 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "No images available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "There are currently no images available in the gallery."
					})
				]
			}),
			!loading && !error && images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: images.map((image) => {
					const imageUrl = image.fileUrl || image.filePath || "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/multimedia/images/$id",
						params: { id: String(image.id) },
						className: "block overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full bg-secondary",
							children: imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: imageUrl,
								alt: image.title,
								className: "h-full w-full object-cover",
								onError: (event) => {
									console.error("Failed to load image:", imageUrl);
									event.currentTarget.style.display = "none";
								}
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-10 w-10 text-muted-foreground" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: image.title
							}), image.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: image.description
							})]
						})]
					}, image.id);
				})
			})
		]
	});
}
//#endregion
export { ImageGalleryPage as component };
