// cli.ts
import { Command, Input, Select } from "../deps.ts";
import { chatWithGemini } from "./chatService.ts";
import { APP_VERSION } from "./constants.ts";
import {
  saveChatHistory,
  loadChatHistory,
  listChatHistories,
} from "./fileService.ts";
import { ChatHistory } from "./interface.ts";

export const cli = new Command()
  .name("ai-cli")
  .version(APP_VERSION)
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
      // Extract the title from the selected history
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

      const response = await chatWithGemini(userInput, chatHistory);
      console.log(`AI-CLI: ${response}`);

      // Add the chat pair to the history
      chatHistory.chats.push({ user: userInput, gemini: response });

      // Save the chat history after each interaction
      await saveChatHistory(chatHistory);

      if (chatHistory.chats.length >= 200) {
        console.log(
          "Chat history reached 200 messages. Starting a new session."
        );
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
