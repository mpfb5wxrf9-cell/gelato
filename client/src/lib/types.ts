export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  publicKey: JsonWebKey;
  avatarColor: string;
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
