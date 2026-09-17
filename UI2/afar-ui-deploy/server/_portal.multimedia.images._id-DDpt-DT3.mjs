import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { H as Image, mt as ArrowLeft } from "./_libs/lucide-react.mjs";
import { r as getMediaUrl } from "./_ssr/multimediaService-KsWseGkg.mjs";
import { t as Route } from "./_portal.multimedia.images._id-CNfCio4C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.multimedia.images._id-DDpt-DT3.js
var import_jsx_runtime = require_jsx_runtime();
function ImageDetailPage() {
	const { item, images } = Route.useLoaderData();
	const imageUrl = item.fileUrl || getMediaUrl(item.filePath) || "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/multimedia/images",
				className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Image Gallery"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-xl border bg-card shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-[450px] items-center justify-center bg-secondary p-4 md:min-h-[600px]",
					children: imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: imageUrl,
						alt: item.title || "Afar UDCB image",
						className: "max-h-[70vh] w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-20 w-20 text-muted-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 md:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold md:text-3xl",
						children: item.title || "Untitled Image"
					}), item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 whitespace-pre-wrap text-muted-foreground",
						children: item.description
					})]
				})]
			}),
			images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: "More Images"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
					children: images.filter((image) => image.id !== item.id).map((image) => {
						const thumbnail = image.fileUrl || getMediaUrl(image.filePath) || "";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/multimedia/images/$id",
							params: { id: String(image.id) },
							className: "group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-44 w-full overflow-hidden bg-secondary",
								children: thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: thumbnail,
									alt: image.title,
									className: "h-full w-full object-cover transition duration-300 group-hover:scale-105"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-full place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-10 w-10 text-muted-foreground" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: image.title || "Untitled Image"
								}), image.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
									children: image.description
								})]
							})]
						}, image.id);
					})
				})]
			})
		]
	});
}
//#endregion
export { ImageDetailPage as component };
