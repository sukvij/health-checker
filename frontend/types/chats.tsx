// types/chat.ts
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai'; // Who sent the message
  timestamp?: string; // Optional: when the message was sent (ISO string)
}

export interface ChatHistory {
  messages: ChatMessage[];
  // Potentially add metadata about the chat session, like participant IDs, etc.
}
