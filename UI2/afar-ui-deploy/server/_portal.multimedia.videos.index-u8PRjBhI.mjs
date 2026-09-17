import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Video } from "./_libs/lucide-react.mjs";
import { i as getMultimedia, r as getMediaUrl } from "./_ssr/multimediaService-KsWseGkg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.multimedia.videos.index-u8PRjBhI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VideoGalleryPage() {
	const [videos, setVideos] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadVideos() {
			try {
				setLoading(true);
				setError(null);
				const data = await getMultimedia();
				setVideos(data.filter((item) => item.type === "video" && item.status === "published"));
			} catch (err) {
				console.error("Failed to load videos:", err);
				setError("Unable to load videos.");
			} finally {
				setLoading(false);
			}
		}
		loadVideos();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold",
				children: "Video Gallery"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Watch videos and multimedia content from AfarUDCB."
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-10 text-center text-muted-foreground",
				children: "Loading videos..."
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-10 text-center text-destructive",
				children: error
			}),
			!loading && !error && videos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border bg-card p-10 text-center shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "mx-auto mb-4 h-10 w-10 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "No videos available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "There are currently no videos available."
					})
				]
			}),
			!loading && !error && videos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: videos.map((video) => {
					const source = video.videoUrl || video.fileUrl || getMediaUrl(video.filePath) || "";
					const poster = video.thumbnail || void 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/multimedia/videos/$id",
						params: { id: String(video.id) },
						className: "group block overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full bg-secondary",
							children: source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
								controls: true,
								poster,
								className: "h-full w-full object-cover",
								onClick: (event) => {
									event.preventDefault();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", { src: source }), "Your browser does not support video playback."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-10 w-10 text-muted-foreground" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold group-hover:text-primary",
								children: video.title || "Untitled Video"
							}), video.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
								children: video.description
							})]
						})]
					}, video.id);
				})
			})
		]
	});
}
//#endregion
export { VideoGalleryPage as component };
