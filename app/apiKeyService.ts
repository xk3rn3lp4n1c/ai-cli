import { Input, Select } from "../deps.ts";

export async function ensureApiKey(): Promise<void> {
  const GEMINI_API_KEY = Deno.env.get("AI_CLI_GEMINI_TOKEN");

  if (!GEMINI_API_KEY) {
    console.error(
      "Error: AI_CLI_GEMINI_TOKEN environment variable is not set."
    );

    // Check if the user wants to set the API key
    const setApiKey = await Select.prompt({
      message: "Do you want to set the API key now?",
      options: [
        { name: "Yes", value: "yes" },
        { name: "No", value: "no" },
      ],
    });

    if (setApiKey === "yes") {
      const apiKey = await Input.prompt("Enter your Gemini API key:");

      // Provide instructions to set the API key permanently
      console.log(`
To set the API key permanently, add the following line to your shell configuration file (e.g., ~/.bashrc, ~/.zshrc, or ~/.profile):

export AI_CLI_GEMINI_TOKEN="${apiKey}"

Then, restart your terminal or run:
source ~/.bashrc  # or source ~/.zshrc, depending on your shell
`);

      // Set the API key for the current session
      Deno.env.set("AI_CLI_GEMINI_TOKEN", apiKey);
      console.log("API key set for the current session.");
    } else {
      console.log(
        "Please set the AI_CLI_GEMINI_TOKEN environment variable and try again."
      );
      Deno.exit(1);
    }
  }
}
