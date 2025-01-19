import { ChatHistory } from "./interface.ts";

// Ensure the chats directory exists
async function ensureChatsDirectory() {
  try {
    await Deno.mkdir("chats", { recursive: true });
  } catch (error) {
    console.error("Error creating chats directory:", error);
  }
}

// Function to save chat history to a JSON file
export async function saveChatHistory(history: ChatHistory): Promise<void> {
  await ensureChatsDirectory(); // Ensure the directory exists
  const fileName = `chats/chat_history_${history.title}.json`;
  console.log(`Saving chat history to: ${fileName}`); // Debug statement
  await Deno.writeTextFile(fileName, JSON.stringify(history, null, 2));
}

// Function to load chat history from a JSON file
export async function loadChatHistory(
  title: string
): Promise<ChatHistory | null> {
  const fileName = `chats/chat_history_${title}.json`;
  console.log(`Loading chat history from: ${fileName}`); // Debug statement
  try {
    const fileContent = await Deno.readTextFile(fileName);
    return JSON.parse(fileContent) as ChatHistory;
  } catch (error) {
    console.error("Error loading chat history:", error);
    return null;
  }
}

// Function to list all chat history files
export async function listChatHistories(): Promise<string[]> {
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
