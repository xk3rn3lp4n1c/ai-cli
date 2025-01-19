import { Command, Input, Select } from "./deps.ts";

// Get the Gemini API key from the environment variable
const GEMINI_API_KEY = Deno.env.get("AI_CLI_GEMINI_TOKEN");

if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set.");
  Deno.exit(1);
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Interface for chat history
interface ChatHistory {
  title: string;
  chats: { user: string; gemini: string }[];
}

// Function to interact with the Gemini API
async function chatWithGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
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

// Ensure the chats directory exists
async function ensureChatsDirectory() {
  try {
    await Deno.mkdir("chats", { recursive: true });
  } catch (error) {
    console.error("Error creating chats directory:", error);
  }
}

// Function to save chat history to a JSON file
async function saveChatHistory(history: ChatHistory): Promise<void> {
  await ensureChatsDirectory(); // Ensure the directory exists
  const fileName = `chats/chat_history_${history.title}.json`;
  await Deno.writeTextFile(fileName, JSON.stringify(history, null, 2));
}

// Function to load chat history from a JSON file
async function loadChatHistory(title: string): Promise<ChatHistory | null> {
  const fileName = `chats/chat_history_${title}.json`;
  try {
    const fileContent = await Deno.readTextFile(fileName);
    return JSON.parse(fileContent) as ChatHistory;
  } catch (error) {
    console.error("Error loading chat history:", error);
    return null;
  }
}

// Function to list all chat history files
async function listChatHistories(): Promise<string[]> {
  await ensureChatsDirectory(); // Ensure the directory exists
  const histories: string[] = [];
  for await (const entry of Deno.readDir("chats")) {
    if (
      entry.name.startsWith("chat_history_") &&
      entry.name.endsWith(".json")
    ) {
      const title = entry.name
        .replace("chat_history_", "")
        .replace(".json", "");
      histories.push(title);
    }
  }
  return histories;
}

const cli = new Command()
  .name("ai-cli")
  .version("1.0.0")
  .description("A CLI chatbot powered by Google Gemini API")
  .action(async () => {
    console.log(`
      █████╗ ██╗    ██████╗██╗     ██╗
     ██╔══██╗██║   ██╔════╝██║     ██║
     ███████║██║   ██║     ██║     ██║
     ██╔══██║██║   ██║     ██║     ██║
     ██║  ██║██║██╗╚██████╗███████╗██║
     ╚═╝  ╚═╝╚═╝╚═╝ ╚═════╝╚══════╝╚═╝
    Welcome to AI-CLI! Type 'exit' to quit.
    `);

    // List available chat histories or start a new one
    const histories = await listChatHistories();
    const choices = [
      ...histories.map((title) => ({ name: title, value: title })),
      { name: "Start a new chat", value: "new" },
    ];

    const selectedHistory = await Select.prompt({
      message: "Choose a chat history or start a new one:",
      options: choices,
    });

    let chatHistory: ChatHistory;
    if (selectedHistory === "new") {
      const title = await Input.prompt("Enter a title for this chat session:");
      chatHistory = { title, chats: [] };
    } else {
      const loadedHistory = await loadChatHistory(selectedHistory);
      if (!loadedHistory) {
        console.log("Failed to load chat history. Starting a new session.");
        const title = await Input.prompt(
          "Enter a title for this chat session:"
        );
        chatHistory = { title, chats: [] };
      } else {
        chatHistory = loadedHistory;
      }
    }

    console.log(`Chat session: ${chatHistory.title}`);
    console.log("Type 'exit' to quit.");

    // Chat loop
    while (true) {
      const userInput = await Input.prompt("You: ");
      if (userInput.toLowerCase() === "exit") {
        console.log("Goodbye!");
        break;
      }

      const response = await chatWithGemini(userInput);
      console.log(`AI-CLI: ${response}`);

      // Add the chat pair to the history
      chatHistory.chats.push({ user: userInput, gemini: response });

      // Save the chat history if it reaches 200 pairs
      if (chatHistory.chats.length >= 200) {
        await saveChatHistory(chatHistory);
        console.log("Chat history saved. Starting a new session.");
        const title = await Input.prompt(
          "Enter a title for the new chat session:"
        );
        chatHistory = { title, chats: [] };
      }
    }

    // Save the chat history before exiting
    await saveChatHistory(chatHistory);
    console.log("Chat history saved.");
  });

// Parse CLI arguments
cli.parse(Deno.args);
