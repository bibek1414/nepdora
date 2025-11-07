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
}

export interface ConversationData {
  id: number;
  page: number;
  page_name: string;
  conversation_id: string;
  participants: Participant[];
  snippet: string;
  updated_time: string;
  last_synced: string;
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
  last_synced: string;
}

// SIMPLIFIED: Remove thread_id - not needed
export interface SendMessageRequest {
  recipient_id: string;
  message: string;
  page_access_token: string;
}

export interface SendMessageResponse {
  message_id: string;
  recipient_id: string;
}
