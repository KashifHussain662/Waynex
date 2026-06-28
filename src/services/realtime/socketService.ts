import { environment } from "../../config/environment";
import { RealtimeChannel, RealtimeEvent, Unsubscribe } from "../../models/realtime";

type Listener<T = unknown> = (event: RealtimeEvent<T>) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private listeners = new Map<RealtimeChannel, Set<Listener>>();
  private reconnectAttempts = 0;

  connect(token?: string) {
    if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const authQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    this.socket = new WebSocket(`${environment.socketUrl}${authQuery}`);

    this.socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as RealtimeEvent;
      this.listeners.get(event.channel)?.forEach((listener) => listener(event));
    };

    this.socket.onclose = () => {
      const delay = Math.min(30000, 1000 * 2 ** this.reconnectAttempts);
      this.reconnectAttempts += 1;
      setTimeout(() => this.connect(token), delay);
    };

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
    };
  }

  subscribe<T>(channel: RealtimeChannel, listener: Listener<T>): Unsubscribe {
    const listeners = this.listeners.get(channel) ?? new Set<Listener>();
    listeners.add(listener as Listener);
    this.listeners.set(channel, listeners);
    this.send("subscribe", { channel });

    return () => {
      listeners.delete(listener as Listener);
      this.send("unsubscribe", { channel });
    };
  }

  publish<T>(channel: RealtimeChannel, type: string, payload: T) {
    this.send("event", {
      id: `${channel}-${Date.now()}`,
      channel,
      type,
      payload,
      sentAt: new Date().toISOString(),
    });
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.listeners.clear();
  }

  private send(type: string, payload: unknown) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }
}

export const socketService = new SocketService();
