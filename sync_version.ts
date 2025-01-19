// bump.ts
import { readTextFile, writeTextFile } from "https://deno.land/std/fs/mod.ts";

const constantsFilePath = "app/constants.ts";

async function bumpVersion(type: "patch" | "minor" | "major") {
  // Read the constants.ts file
  const constantsFile = await readTextFile(constantsFilePath);

  // Extract the current version
  const versionMatch = constantsFile.match(
    /export const APP_VERSION = "(\d+\.\d+\.\d+)"/
  );
  if (!versionMatch) {
    throw new Error("APP_VERSION not found in constants.ts");
  }

  const currentVersion = versionMatch[1];
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  // Increment the version
  let newVersion: string;
  switch (type) {
    case "patch":
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    case "minor":
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case "major":
      newVersion = `${major + 1}.0.0`;
      break;
    default:
      throw new Error(
        "Invalid version type. Use 'patch', 'minor', or 'major'."
      );
  }

  // Replace the old version with the new version
  const updatedFile = constantsFile.replace(
    /export const APP_VERSION = "\d+\.\d+\.\d+"/,
    `export const APP_VERSION = "${newVersion}"`
  );

  // Write the updated file
  await writeTextFile(constantsFilePath, updatedFile);

  console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
}

// Get the bump type from command-line arguments
const type = Deno.args[0];
if (!["patch", "minor", "major"].includes(type)) {
  console.error(
    "Usage: deno run --allow-read --allow-write bump.ts <patch|minor|major>"
  );
  Deno.exit(1);
}

// Bump the version
bumpVersion(type as "patch" | "minor" | "major");
