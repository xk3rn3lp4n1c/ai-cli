const projectFile = "project.json";
const constantsFile = "app/constants.ts";
const changelogFile = "CHANGELOG.md";

// Helper function to prompt the user for input
async function promptInput(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  await Deno.stdout.write(encoder.encode(`${message}: `));
  const buf = new Uint8Array(1024);
  const n = <number>await Deno.stdin.read(buf);

  return decoder.decode(buf.subarray(0, n)).trim();
}

// Step 1: Read version from project.json
const projectContent = await Deno.readTextFile(projectFile);
const { version } = JSON.parse(projectContent);

// Step 2: Update APP_VERSION in constants.ts
const constantsContent = await Deno.readTextFile(constantsFile);
const updatedConstants = constantsContent.replace(
  /export const APP_VERSION = ".*?";/,
  `export const APP_VERSION = "${version}";`
);
await Deno.writeTextFile(constantsFile, updatedConstants);

// Step 3: Prompt for changelog details
console.log(`Preparing changelog entry for version ${version}...`);
const addedDetails = await promptInput(
  "Enter details of new features (comma-separated)"
);
const fixedDetails = await promptInput(
  "Enter details of fixes (comma-separated)"
);

// Format the changelog entry
const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
const addedList = addedDetails
  .split(",")
  .map((item) => `- ${item.trim()}`)
  .join("\n");
const fixedList = fixedDetails
  .split(",")
  .map((item) => `- ${item.trim()}`)
  .join("\n");

const newChangelogEntry = `
## [${version}] - ${currentDate}

### Added

${addedList || "- No new features listed."}

### Fixed

${fixedList || "- No fixes listed."}
`;

// Step 4: Append the new changelog entry
const changelogContent = await Deno.readTextFile(changelogFile);
const updatedChangelog = changelogContent.replace(
  /# Changelog/,
  `# Changelog\n${newChangelogEntry.trim()}\n`
);
await Deno.writeTextFile(changelogFile, updatedChangelog);

// Final message
console.log(
  `Version ${version} synchronized in ${constantsFile} and added to ${changelogFile}.`
);
