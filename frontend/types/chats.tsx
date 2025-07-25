// types/chat.ts

/**
 * Represents a single message entry as returned from the backend's /history endpoint.
 * This structure contains both the user's input (text) and the AI's reply (response).
 * For display in the UI, these often need to be split into separate message bubbles.
 */
export interface BackendChatMessage {
  id: number;
  user_id: number; // Corresponds to GORM's UserId (uint)
  text: string;    // The user's message content
  sender: 'user' | 'ai'; // Who sent the message ('user' or 'ai')
  response: string; // The AI's response to the 'text' message
  timestamp: string; // ISO 8601 string for when the message was sent/recorded
}

/**
 * Represents a single message for display in the frontend UI (a chat bubble).
 * This is derived from BackendChatMessage, splitting the user's message and AI's response
 * into distinct entries for the FlatList.
 */
export interface ChatMessage {
  id: number;
  userId: number; // Changed to camelCase for frontend consistency
  text: string; // The content of this specific message bubble (either user's or AI's)
  sender: 'user' | 'ai';
  timestamp: string;
}

/**
 * Represents a collection of chat messages for a session.
 * (Currently, this might not be directly used for fetching, but good for defining structure).
 */
export interface ChatHistory {
  messages: ChatMessage[];
  // Potentially add other metadata like chat session ID if applicable
}
