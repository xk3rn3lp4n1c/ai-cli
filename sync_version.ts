const projectFile = "project.json";
const constantsFile = "app/constants.ts";
const changelogFile = "CHANGELOG.md";

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

// Step 3: Append new changelog entry
const changelogContent = await Deno.readTextFile(changelogFile);
const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

const newChangelogEntry = `
## [${version}] - ${currentDate}

### Added

- Describe the new features added here.

### Fixed

- List any bug fixes or improvements here.
`;

const updatedChangelog = changelogContent.replace(
  /# Changelog/,
  `# Changelog\n${newChangelogEntry.trim()}\n`
);
await Deno.writeTextFile(changelogFile, updatedChangelog);

console.log(
  `Version ${version} synchronized in ${constantsFile} and added to ${changelogFile}.`
);
