// File paths
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

// Helper function to read a file and handle errors
async function readFile(filePath: string): Promise<string> {
  try {
    return await Deno.readTextFile(filePath);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    Deno.exit(1);
  }
}

// Helper function to write a file and handle errors
async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    await Deno.writeTextFile(filePath, content);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    Deno.exit(1);
  }
}

//  Read version from project.json
const projectContent = await readFile(projectFile);
const { version } = JSON.parse(projectContent);

// Update APP_VERSION in constants.ts
const constantsContent = await readFile(constantsFile);
const updatedConstants = constantsContent.replace(
  /export const APP_VERSION = ".*?";/,
  `export const APP_VERSION = "${version}";`
);
await writeFile(constantsFile, updatedConstants);

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

// Append the new changelog entry
const changelogContent = await readFile(changelogFile);
const updatedChangelog = changelogContent.replace(
  /# Changelog/,
  `# Changelog\n${newChangelogEntry.trim()}\n`
);
await writeFile(changelogFile, updatedChangelog);

console.log(
  `Version ${version} synchronized in ${constantsFile} and added to ${changelogFile}.`
);
