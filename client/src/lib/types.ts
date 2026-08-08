export interface PublicUser {
  id: string;
  phone: string;
  nickname: string;
  bio: string;
  publicKey: JsonWebKey;
  avatarColor: string;
  avatarUrl: string | null;
}

export interface ConversationSummary {
  id: string;
  peer: PublicUser | null;
  lastMessage: RawMessage | null;
  unread: number;
  createdAt: number;
}

export interface RawMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  ciphertext: string;
  iv: string;
  createdAt: number;
  delivered?: boolean;
  read?: boolean;
}

export interface DecryptedMessage extends RawMessage {
  text: string;
  failed?: boolean;
  pending?: boolean;
}
