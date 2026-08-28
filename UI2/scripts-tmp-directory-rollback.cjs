/**
 * TEMPORARY rollback helper — removes ONLY the Directorate
 * detail-page attempt created during this session:
 *
 *   1. Restores src/routes/_portal.directory.tsx from its
 *      byte-exact pre-attempt backup (.pre-detail-link.bak)
 *      using a raw Buffer copy (no EOL/encoding conversion).
 *   2. Verifies the restored listing from disk (with retries).
 *   3. Deletes the three session-created artifacts:
 *        - src/routes/_portal.directory.$id.tsx
 *        - scripts-tmp-directory-link.cjs
 *        - src/routes/_portal.directory.tsx.pre-detail-link.bak
 *
 * Self-deletion is intentionally NOT performed here so the
 * running script never deletes its own executable.
 */
const fs = require("fs");

const ROOT = "c:/Users/Hp/Desktop/Afar-project/UI2";
const LISTING = ROOT + "/src/routes/_portal.directory.tsx";
const BAK = LISTING + ".pre-detail-link.bak";
const DETAIL_ROUTE = ROOT + "/src/routes/_portal.directory.$id.tsx";
const LINK_HELPER = ROOT + "/scripts-tmp-directory-link.cjs";

function fail(msg) {
  console.error("ROLLBACK ABORTED:", msg);
  process.exit(1);
}

// ---------- Phase 1: capture pristine content ----------
if (!fs.existsSync(BAK)) fail("backup missing: " + BAK);

const bakBytes = fs.readFileSync(BAK);
if (!bakBytes || bakBytes.length === 0) fail("backup is empty");
console.log("backup bytes:", bakBytes.length);

// Sanity markers expected inside the ORIGINAL listing.
const bakText = bakBytes.toString("utf8");
if (!bakText.includes("key={d.id}")) fail("backup lacks card anchor");
if (!bakText.includes("(e) => e.preventDefault()")) fail("backup lacks original onClick");
if (bakText.includes("/directory/$id")) fail("backup unexpectedly contains detail link");

// ---------- Phase 2: raw buffer restore ----------
fs.writeFileSync(LISTING, bakBytes);

// ---------- Phase 3: persisted verification (retry loop) ----------
let ok = false;
for (let attempt = 1; attempt <= 5 && !ok; attempt++) {
  const now = fs.readFileSync(LISTING); // Buffer compare against source
  const matches =
    now.length === bakBytes.length && Buffer.compare(now, bakBytes) === 0;

  const txt = now.toString("utf8");
  ok =
    matches &&
    !txt.includes("/directory/$id") &&
    !txt.includes("to=\"/directory") &&
    !txt.includes("stopPropagation") &&
    txt.split("(e) => e.preventDefault()").length - 1 === 2 &&
    txt.includes("<div") ;

  console.log(
    "attempt", attempt,
    "-> byte-equal:", matches ? "PASS" : "FAIL",
    "| behavior-restored:", ok ? "PASS" : "FAIL"
  );
}
if (!ok) fail("restore did not persist cleanly after retries");

// ---------- Phase 4: delete session artifacts ----------
const targets = [
  ["detail-route", DETAIL_ROUTE],
  ["link-helper", LINK_HELPER],
  ["backup-snapshot", BAK],
];

for (const [label, p] of targets) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p);
      console.log("deleted", label + ":", !fs.existsSync(p) ? "OK" : "STILL PRESENT!");
    } else {
      console.log("deleted", label + ": already absent");
    }
  } catch (e) {
    console.error("delete-failed", label, String(e));
    process.exit(1);
  }
}

console.log("RESULT: ROLLBACK COMPLETE");
process.exit(0);
