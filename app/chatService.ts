import { GEMINI_API_URL } from "./constants.ts";
import { ChatHistory } from "./interface.ts";

const GEMINI_API_KEY = Deno.env.get("AI_CLI_GEMINI_TOKEN");

if (!GEMINI_API_KEY) {
  console.error("Error: AI_CLI_GEMINI_TOKEN environment variable is not set.");
  Deno.exit(1);
}

const GEMINI_API = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

// Function to interact with the Gemini API
export async function chatWithGemini(
  prompt: string,
  history: ChatHistory
): Promise<string> {
  try {
    // Convert chat history into the format expected by Gemini API
    const messages = history.chats
      .map((chat) => [
        { role: "user", parts: [{ text: chat.user }] },
        { role: "model", parts: [{ text: chat.gemini }] },
      ])
      .flat();

    // Add the current prompt
    messages.push({ role: "user", parts: [{ text: prompt }] });

    const response = await fetch(GEMINI_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, something went wrong.";
  }
}
