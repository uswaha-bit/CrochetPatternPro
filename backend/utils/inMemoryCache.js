// A simple in-memory cache using a JavaScript Map
const chatHistoryCache = new Map();

/**
 * Stores chat history for a user in memory.
 * @param {string} userId - Unique identifier for the user.
 * @param {Array<Object>} history - Array of message objects ({ role: 'user' | 'model', parts: [{ text: string }] }).
 */
export function saveChatHistory(userId, history) {
  chatHistoryCache.set(userId, history);
  console.log(`Chat history for user ${userId} saved to in-memory cache.`);
}

/**
 * Retrieves chat history for a user from memory.
 * @param {string} userId - Unique identifier for the user.
 * @returns {Array<Object> | null} - Array of message objects or null if not found.
 */
export function getChatHistory(userId) {
  const history = chatHistoryCache.get(userId);
  if (history) {
    return history;
  }
  return null;
}

/**
 * Deletes chat history for a user from memory.
 * @param {string} userId - Unique identifier for the user.
 * @returns {boolean} - True if deleted, false otherwise.
 */
export function deleteChatHistory(userId) {
  const wasDeleted = chatHistoryCache.delete(userId);
  if (wasDeleted) {
    console.log(`Chat history for user ${userId} deleted from in-memory cache.`);
  } else {
    console.log(`No chat history found for user ${userId} to delete from in-memory cache.`);
  }
  return wasDeleted;
}