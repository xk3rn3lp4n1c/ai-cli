const projectFile = "project.json";
const constantsFile = "app/constants.ts";

const projectContent = await Deno.readTextFile(projectFile);
const { version } = JSON.parse(projectContent);

const constantsContent = await Deno.readTextFile(constantsFile);
const updatedConstants = constantsContent.replace(
  /export const APP_VERSION = ".*?";/,
  `export const APP_VERSION = "${version}";`
);

await Deno.writeTextFile(constantsFile, updatedConstants);