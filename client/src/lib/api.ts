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
  register: (username: string, password: string, displayName: string, publicKey: JsonWebKey) =>
    request<{ token: string; user: PublicUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, displayName, publicKey }),
    }),

  login: (username: string, password: string) =>
    request<{ token: string; user: PublicUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () => request<{ user: PublicUser }>('/users/me'),

  updatePublicKey: (publicKey: JsonWebKey) =>
    request<{ user: PublicUser }>('/users/me/public-key', {
      method: 'PATCH',
      body: JSON.stringify({ publicKey }),
    }),

  searchUsers: (q: string) => request<{ users: PublicUser[] }>(`/users/search?q=${encodeURIComponent(q)}`),

  listConversations: () => request<{ conversations: ConversationSummary[] }>('/conversations'),

  getConversation: (id: string) => request<{ conversation: ConversationSummary }>(`/conversations/${id}`),

  createConversation: (username: string) =>
    request<{ conversation: ConversationSummary }>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  getMessages: (conversationId: string, before?: number) =>
    request<{ messages: RawMessage[] }>(
      `/conversations/${conversationId}/messages${before ? `?before=${before}` : ''}`
    ),
};

export { ApiError };
