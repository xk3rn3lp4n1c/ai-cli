// Interface for chat history
export interface ChatHistory {
  title: string;
  chats: { user: string; gemini: string }[];
}
