import type { RawMessage } from './types';

type ServerEvent =
  | { type: 'connected'; userId: string }
  | ({ type: 'message' } & RawMessage)
  | { type: 'ack'; clientId: string; id: string; createdAt: number; delivered: boolean }
  | { type: 'typing'; conversationId: string; from: string }
  | { type: 'read'; conversationId: string; by: string }
  | { type: 'error'; error: string };

type Listener = (event: ServerEvent) => void;

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private token: string;
  private listeners = new Set<Listener>();
  private reconnectDelay = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closedByUser = false;

  constructor(token: string) {
    this.token = token;
  }

  connect(): void {
    this.closedByUser = false;
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    this.ws = new WebSocket(`${protocol}://${location.host}/ws?token=${encodeURIComponent(this.token)}`);

    this.ws.onopen = () => {
      this.reconnectDelay = 1000;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerEvent;
        this.listeners.forEach((l) => l(data));
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onclose = () => {
      if (this.closedByUser) return;
      this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.6, 15000);
    };
  }

  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  send(payload: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  close(): void {
    this.closedByUser = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }
}

export type { ServerEvent };
