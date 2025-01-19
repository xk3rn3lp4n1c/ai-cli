# AI-CLI

AI-CLI is a command-line interface (CLI) chatbot powered by the **Google Gemini API**. It allows users to interact with an AI-powered assistant directly from their terminal. The app supports saving and loading chat histories, making it easy to continue conversations across sessions. Users can start new chats or resume previous ones, and all interactions are stored locally in JSON files for future reference.

---

## Key Features

- **Chat with AI**: Interact with the Google Gemini API to get responses to your queries.
- **Chat History**: Save and load chat sessions with unique titles.
- **Persistent Storage**: All chat histories are stored locally in the `chats` directory.
- **User-Friendly**: Simple prompts and options for managing chats.
- **Customizable**: Set your Gemini API key via environment variables.

---

## Example Usage

1. Start a new chat session:
   ```bash
   deno run --allow-net --allow-env --allow-read --allow-write main.ts
   ```
2. Choose to Start a New Chat or Load an Existing One

	When you run the app, you'll be prompted to either:
- Start a new chat session.
- Load an existing chat history by selecting from a list of saved sessions.

3. Type Your Messages and Get AI Responses in Real-Time

- Simply type your message, and the AI will respond instantly.
- The conversation will continue until you type `exit` to end the session.

4. Type `exit` to End the Session and Save the Chat History

- When you're done, type `exit` to save the chat history and exit the app.
- Your chat history will be saved in the `chats` directory as a JSON file for future reference.

---

## Requirements

- A valid **Google Gemini API key** (set as the `AI_CLI_GEMINI_TOKEN` environment variable). Get your API key from the [Google Cloud Console](https://console.cloud.google.com/).
- [Deno runtime](https://deno.land/) installed.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xk3rn3lp4n1c/ai-cli.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ai-cli
   ```
3. Run the app:
   ```bash
   deno run --allow-net --allow-env --allow-read --allow-write main.ts
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

&copy; 2025 xk3rn3lp4n1c