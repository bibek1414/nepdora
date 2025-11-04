// lib/facebook-utils.ts - Helper to manage conversation IDs
export class ConversationIdManager {
  /**
   * Convert between different conversation ID formats
   */
  static normalizeConversationId(
    conversationId: string,
    pageId?: string,
    senderId?: string
  ): string {
    console.log(`🔄 Normalizing conversation ID: ${conversationId}`);

    // If it's already in the format we use (t_pageId_senderId)
    if (conversationId.startsWith("t_") && conversationId.includes("_")) {
      const parts = conversationId.split("_");
      if (parts.length === 3) {
        console.log(`✅ Already normalized: ${conversationId}`);
        return conversationId;
      }
    }

    // If it's a thread ID from Facebook (like t_122170001792604595)
    // and we have pageId and senderId, construct the proper format
    if (conversationId.startsWith("t_") && pageId && senderId) {
      const normalizedId = `t_${pageId}_${senderId}`;
      console.log(`🔄 Converted ${conversationId} to ${normalizedId}`);
      return normalizedId;
    }

    // If we have pageId and senderId, construct the ID
    if (pageId && senderId) {
      const constructedId = `t_${pageId}_${senderId}`;
      console.log(`🔄 Constructed ID: ${constructedId}`);
      return constructedId;
    }

    console.log(`❓ Could not normalize: ${conversationId}`);
    return conversationId;
  }

  /**
   * Extract pageId and senderId from conversation ID
   */
  static parseConversationId(conversationId: string): {
    pageId?: string;
    senderId?: string;
  } {
    if (conversationId.startsWith("t_") && conversationId.includes("_")) {
      const parts = conversationId.split("_");
      if (parts.length === 3) {
        return {
          pageId: parts[1],
          senderId: parts[2],
        };
      }
    }
    return {};
  }
}
