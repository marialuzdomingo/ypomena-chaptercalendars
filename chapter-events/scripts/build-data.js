// Run with: node scripts/build-data.js
// Reads data/events.csv, writes data/events.json.
// Run this every time you update data/events.csv, then redeploy.

const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "..", "data", "events.csv");
const JSON_PATH = path.join(__dirname, "..", "data", "events.json");

// Column names as they appear in the CSV header row.
// Edit these ONLY if your exported CSV uses different column names.
const COLUMNS = {
  chapter: "Chapter Name",
  eventName: "Name",
  date: "Date",
  status: "Event Status",
  eventType: "Event Type",
  location: "City/Country",
  description: "Event Description",
  link: "Link", // no link column in the current export — stays blank, that's fine
  openToRegion: "COR / Open to Region",
  lifelongLearningCategories: "Lifelong Learning Categories",
  topicCategory: "Topic Category",
  resource: "Speaker / Resource",
  resourceStatus: "Resource Status",
  targetAudience: "Target Audience",
};

// Columns that are allowed to be missing from the CSV without a warning.
const OPTIONAL_COLUMNS = new Set([
  "description",
  "link",
  "eventType",
  "location",
  "openToRegion",
  "lifelongLearningCategories",
  "topicCategory",
  "resource",
  "resourceStatus",
  "targetAudience",
]);

function parseCsv(text) {
  // Minimal CSV parser: handles quoted fields, commas and newlines inside quotes, and "" as an escaped quote.
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

// Corrects known naming inconsistencies coming out of Airtable, so the site
// always shows the right chapter name even if the export has it wrong.
// Add more entries here any time a chapter's name shows up incorrectly.
const CHAPTER_NAME_CORRECTIONS = {
  "YPO MENA Olive Regional Integrated": "YPO Olive MENA Regional Integrated",
};

function correctChapterName(name) {
  return CHAPTER_NAME_CORRECTIONS[name] ?? name;
}

// Every 2025 date across the whole dataset should actually be 2026 — a mistake
// several chapters made independently when filling in their calendars.
// If this ever needs to be chapter-specific again, add per-chapter overrides here.
const GLOBAL_YEAR_CORRECTIONS = { 2025: 2026 };

function correctDate(isoDate) {
  if (!isoDate) return isoDate;
  const year = Number(isoDate.slice(0, 4));
  const correctedYear = GLOBAL_YEAR_CORRECTIONS[year];
  if (!correctedYear) return isoDate;
  return `${correctedYear}${isoDate.slice(4)}`;
}

function toIsoDate(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return null;

  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const dd = String(parsed.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`Couldn't find ${CSV_PATH}. Export your Airtable base as CSV and save it there.`);
    process.exit(1);
  }

  const text = fs.readFileSync(CSV_PATH, "utf-8").replace(/^\uFEFF/, "");
  const rows = parseCsv(text);

  if (rows.length < 2) {
    console.error("CSV looks empty (no data rows found).");
    process.exit(1);
  }

  const header = rows[0].map((h) => h.trim());
  const colIndex = {};
  for (const [key, colName] of Object.entries(COLUMNS)) {
    const idx = header.indexOf(colName);
    if (idx === -1 && !OPTIONAL_COLUMNS.has(key)) {
      console.warn(`Warning: expected column "${colName}" not found in CSV header. Found: ${header.join(", ")}`);
    }
    colIndex[key] = idx;
  }

  const events = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const get = (key) => {
      const idx = colIndex[key];
      if (idx === undefined || idx === -1) return null;
      const val = cells[idx];
      return val && val.trim() !== "" ? val.trim() : null;
    };

    const name = get("eventName");
    const chapterName = get("chapter") ? correctChapterName(get("chapter")) : null;

    if (!name || !chapterName) {
      skipped++;
      continue;
    }

    events.push({
      id: `row-${i}`,
      chapterName,
      name,
      date: correctDate(toIsoDate(get("date"))),
      status: get("status"),
      eventType: get("eventType"),
      location: get("location"),
      description: get("description"),
      link: get("link"),
      openToRegion: get("openToRegion"),
      lifelongLearningCategories: get("lifelongLearningCategories"),
      topicCategory: get("topicCategory"),
      resource: get("resource"),
      resourceStatus: get("resourceStatus"),
      targetAudience: get("targetAudience"),
    });
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(events, null, 2));

  console.log(`Wrote ${events.length} events to data/events.json${skipped > 0 ? ` (skipped ${skipped} rows missing a name or chapter)` : ""}.`);
}

main();
