import type { ConversationSummary, PublicUser, RawMessage } from './types';

const TOKEN_KEY = 'aria.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error || 'Errore di rete', res.status);
  }
  return body as T;
}

export const api = {
  requestOtp: (phone: string) =>
    request<{ sent: boolean; devCode: string | null; phone: string }>('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    request<
      | { isNewUser: false; token: string; user: PublicUser }
      | { isNewUser: true; registrationToken: string }
    >('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  register: (registrationToken: string, nickname: string, bio: string, publicKey: JsonWebKey) =>
    request<{ token: string; user: PublicUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ registrationToken, nickname, bio, publicKey }),
    }),

  me: () => request<{ user: PublicUser }>('/users/me'),

  updateProfile: (fields: { nickname?: string; bio?: string }) =>
    request<{ user: PublicUser }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(fields),
    }),

  uploadAvatar: (imageBase64: string) =>
    request<{ user: PublicUser }>('/users/me/avatar', {
      method: 'POST',
      body: JSON.stringify({ imageBase64 }),
    }),

  removeAvatar: () => request<{ user: PublicUser }>('/users/me/avatar', { method: 'DELETE' }),

  updatePublicKey: (publicKey: JsonWebKey) =>
    request<{ user: PublicUser }>('/users/me/public-key', {
      method: 'PATCH',
      body: JSON.stringify({ publicKey }),
    }),

  searchUsers: (q: string) => request<{ users: PublicUser[] }>(`/users/search?q=${encodeURIComponent(q)}`),

  getUserByPhone: (phone: string) => request<{ user: PublicUser }>(`/users/by-phone/${encodeURIComponent(phone)}`),

  syncContacts: (phones: string[]) =>
    request<{ users: PublicUser[] }>('/users/contacts/sync', {
      method: 'POST',
      body: JSON.stringify({ phones }),
    }),

  listConversations: () => request<{ conversations: ConversationSummary[] }>('/conversations'),

  getConversation: (id: string) => request<{ conversation: ConversationSummary }>(`/conversations/${id}`),

  createConversation: (phone: string) =>
    request<{ conversation: ConversationSummary }>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  getMessages: (conversationId: string, before?: number) =>
    request<{ messages: RawMessage[] }>(
      `/conversations/${conversationId}/messages${before ? `?before=${before}` : ''}`
    ),
};

export { ApiError };
