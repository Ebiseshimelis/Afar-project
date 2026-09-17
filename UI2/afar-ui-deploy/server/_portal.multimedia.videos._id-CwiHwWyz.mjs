import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { T as Play, mt as ArrowLeft, n as Video } from "./_libs/lucide-react.mjs";
import { r as getMediaUrl } from "./_ssr/multimediaService-KsWseGkg.mjs";
import { t as Route } from "./_portal.multimedia.videos._id-CaKzRriu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.multimedia.videos._id-CwiHwWyz.js
var import_jsx_runtime = require_jsx_runtime();
function VideoDetailPage() {
	const { item, videos } = Route.useLoaderData();
	const videoUrl = item.videoUrl || item.fileUrl || getMediaUrl(item.filePath) || "";
	const poster = item.thumbnail || void 0;
	const otherVideos = videos.filter((video) => video.id !== item.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/multimedia/videos",
				className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Video Gallery"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-xl border bg-card shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-[450px] items-center justify-center bg-black p-4 md:min-h-[600px]",
					children: videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: videoUrl,
						controls: true,
						autoPlay: true,
						playsInline: true,
						preload: "metadata",
						poster,
						className: "block max-h-[70vh] w-full object-contain",
						onError: (event) => {
							console.error("Failed to load video:", videoUrl, event.currentTarget.error);
						},
						children: "Your browser does not support video playback."
					}, videoUrl) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center text-center text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-20 w-20 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg",
							children: "Video is currently unavailable."
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 md:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold md:text-3xl",
						children: item.title || "Untitled Video"
					}), item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 whitespace-pre-wrap text-muted-foreground",
						children: item.description
					})]
				})]
			}),
			otherVideos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "More Videos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/multimedia/videos",
						className: "text-sm font-medium text-primary hover:underline",
						children: "View all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
					children: otherVideos.map((video) => {
						const source = video.videoUrl || video.fileUrl || getMediaUrl(video.filePath) || "";
						const poster = video.thumbnail || void 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/multimedia/videos/$id",
							params: { id: String(video.id) },
							className: "group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-44 w-full overflow-hidden bg-secondary",
								children: [source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: source,
									poster,
									muted: true,
									preload: "metadata",
									playsInline: true,
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-full place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-10 w-10 text-muted-foreground" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-1 h-5 w-5 fill-current" })
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: video.title || "Untitled Video"
								}), video.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
									children: video.description
								})]
							})]
						}, video.id);
					})
				})]
			})
		]
	});
}
//#endregion
export { VideoDetailPage as component };
