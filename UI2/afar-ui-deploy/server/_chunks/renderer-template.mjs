import { r as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";
//#region #nitro/virtual/renderer-template
var rendererTemplate = () => new HTTPResponse("﻿<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta name=\"theme-color\" content=\"#ffffff\" />\n\n    <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\" />\n    <link rel=\"shortcut icon\" type=\"image/png\" href=\"/favicon.png\" />\n\n    <title>Afar Regional Government Portal</title>\n  </head>\n\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"><\/script>\n  </body>\n</html>\r\n", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
	return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };
