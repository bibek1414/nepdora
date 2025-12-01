export interface Participant {
  id: string;
  name: string;
  email?: string;
  profile_pic?: string;
}

export interface MessageData {
  id: string;
  from: Participant;
  message: string;
  created_time: string;
  conversationId: string;
  attachments?: Attachment[];
  isOptimistic?: boolean;
}

export interface ConversationData {
  id: number;
  page: number;
  page_name: string;
  conversation_id: string;
  participants: Participant[];
  snippet: string;
  updated_time: string;
  messages?: MessageData[];
}

export interface ConversationDetailResponse {
  conversation: ConversationData;
}

export interface ConversationListItem {
  id: number;
  page: number;
  page_name: string;
  conversation_id: string;
  participants: Participant[];
  snippet: string;
  updated_time: string;
  message_type?: "text" | "image" | "video" | "audio" | "file" | string;
}

// SIMPLIFIED: Remove thread_id - not needed
export interface SendMessageRequest {
  recipient_id: string;
  message?: string;
  page_access_token: string;
  tag?: string;
  attachment?: {
    type: "image" | "audio" | "video" | "file";
    payload: {
      url?: string;
      is_reusable?: boolean;
    };
  };
  fileUpload?: File | Blob;
}

export interface SendMessageResponse {
  message_id: string;
  recipient_id: string;
}

export interface WebhookNewMessageEvent {
  tenant: string;
  type: "new_message";
  data: {
    conversation_id: string;
    message: MessageData;
    attachments?: Attachment[];
    page_id: string;
    snippet: string;
    sender_name: string;
    sender_id: string;
    timestamp: string;
    message_type: "text" | "image" | "video" | "audio" | "file" | string;
  };
}

export interface Attachment {
  sticker_id?: string;
  type?: string;
  url?: string;
  isOptimistic?: boolean;
}
