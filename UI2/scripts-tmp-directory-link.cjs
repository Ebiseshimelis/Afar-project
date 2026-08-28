/**
 * TEMPORARY helper for the Directorate detail-page feature.
 * Converts each Directorate card in src/routes/_portal.directory.tsx
 * into a TanStack Router <Link to="/directory/$id"> while keeping the
 * card visuals unchanged, and preserves the existing phone/email row
 * click-suppression semantics.
 *
 * Self-verifying: after writing, it re-reads the file from disk
 * (with retries) and reports PASS/FAIL. Run manually with:
 *   node scripts-tmp-directory-link.cjs
 */
const fs = require("fs");

const PATH =
  "c:/Users/Hp/Desktop/Afar-project/UI2/src/routes/_portal.directory.tsx";

const OPEN_OLD = '              <div\n                key={d.id}';
const OPEN_NEW =
  '              <Link\n                to="/directory/$id"\n                params={{ id: String(d.id) }}\n                key={d.id}';

const CLOSE_OLD = "                </div>\n              </div>\n            ))}";
const CLOSE_NEW = "                </div>\n              </Link>\n            ))}";

const PD_OLD = "(e) => e.preventDefault()";
const PD_NEW = "(e) => {\n                        e.preventDefault();\n                        e.stopPropagation();\n                      }";

const LF = String.fromCharCode(10);
const WS16LINE = "                ";

function loadText() {
  const buf = fs.readFileSync(PATH);
  const bom = buf.length >= 3 && buf[0] === 239 && buf[1] === 187 && buf[2] === 191;
  return { bom, text: buf.toString("utf8") };
}

let { bom, text } = loadText();

// ---------- guards (pre) ----------
if (!text.includes("key={d.id}")) throw new Error("GUARD: anchor key missing");
if ((text.match(/<div(?![\w])/g) || []).filter(Boolean).length < 3)
  console.log("INFO: expected several <div tags (advisory)");

const pdCountPre = text.split(PD_OLD).length - 1;
if (pdCountPre !== 2)
  throw new Error("GUARD: preventDefault occurrences = " + pdCountPre);

const openCountPre = text.split(OPEN_OLD).length - 1;
if (openCountPre !== 1)
  throw new Error(
    "GUARD: opening div anchor occurrences = " +
      openCountPre +
      " (whitespace variant mismatch)"
  );

const closerPat = "</div>" + LF + WS16LINE.slice(0, 12) + "))}" ;
const closeCountPre = text.split(closerPat.replace("</div>", "</div>")).length - 1;

// Build precise closer using raw layout: </div>(16sp indent)\n </div>(14sp)\n 12sp)))}
const CLOSE_RAW =
  "</div>" + LF + "              </div>" + LF + "            ))}";
if (text.indexOf(CLOSE_RAW) < 0) throw new Error("GUARD: closing anchor missing");
if (text.indexOf(CLOSE_RAW) !== text.lastIndexOf(CLOSE_RAW))
  throw new Error("GUARD: closing anchor not unique");

// ---------- transform ----------
text = text.replace(OPEN_OLD, OPEN_NEW);
text = text.replace(CLOSE_RAW, CLOSE_NEW);
if (pdCountPre === 2) {
  text = text.replace(PD_OLD, PD_NEW); // Phone row (first occurrence)
  text = text.replace(PD_OLD, PD_NEW); // Mail row (remaining occurrence)
}

// ---------- persist + self-verify ----------
function saveAndVerify(attempt) {
  // NOTE: "text" already carries the original BOM character
  // (if any) because Buffer.toString("utf8") keeps it, so we
  // must NOT prepend another one here.
  fs.writeFileSync(PATH, text, "utf8");
  const recheck = fs.readFileSync(PATH, "utf8").replace(/^\ufeff/, "");
  const linkCloses = recheck.split("</Link>").length - 1;
  const stops = recheck.split("stopPropagation").length - 1;
  const pass =
    recheck.includes('to="/directory/$id"') &&
    linkCloses === 1 &&
    stops === 2 &&
    !recheck.includes("(e) => e.preventDefault()");
  console.log("attempt", attempt, "-> persisted-verify:", pass ? "PASS" : "FAIL", "| closes:", linkCloses, "| stops:", stops);
  return pass;
}

let ok = false;
for (let i = 1; i <= 5 && !ok; i++) ok = saveAndVerify(i);

console.log("final markers:");
console.log("  LinkOpen:", (loadText().text.match(/directory\/\$id/) || []).length);
console.log("  CloseLink:", (loadText().text.split("</Link>").length - 1));
console.log("  preventDefault-old:", (loadText().text.split(PD_OLD).length - 1));
console.log(ok ? "RESULT: ALL EDITS PERSISTED" : "RESULT: WRITE DID NOT PERSIST");
process.exit(ok ? 0 : 1);
