import { useChatStore } from '@koudmain/ui/store/useChatStore';
import { refreshAccessToken, transformIpBackendUrl } from '@koudmain/ui/utils/api';

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

const API_URL = transformIpBackendUrl(RAW_API_HOST, 4000);

const RECONNECT_DELAY_MS = 5000;

const isExpired = (token: string) => {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = part + '='.repeat((4 - (part.length % 4)) % 4);
    const { exp } = JSON.parse(atob(padded)) as { exp?: number };
    return typeof exp === 'number' && exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

class SocketService {
  private socket: WebSocket | null = null;
  private isExplicitlyClosed = false;
  private token: string | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(token: string) {
    this.token = token;
    if (this.socket || this.reconnectTimer || !token) return;

    this.isExplicitlyClosed = false;
    this.open();
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.token = null;
    this.socket?.close();
    this.socket = null;
  }

  private open() {
    if (!this.token) return;

    try {
      this.socket = new WebSocket(
        API_URL.replace(/^http/, 'ws') + `/ws?token=${encodeURIComponent(this.token)}`,
      );

      this.socket.onopen = () => {
        console.log('WebSocket: connecté avec succès');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'MESSAGE' || data.content_text) {
            useChatStore.getState().addMessage(data);
          }
        } catch (e) {
          console.error('Erreur parsing WS', e);
        }
      };

      this.socket.onerror = (e: Event) => {
        console.error('WebSocket: erreur de connexion', e);
      };

      this.socket.onclose = (e) => {
        this.socket = null;
        if (!this.isExplicitlyClosed && e.code !== 1000) this.scheduleReconnect();
      };
    } catch (err) {
      console.error('WebSocket: erreur fatale lors de la création', err);
    }
  }

  private scheduleReconnect() {
    console.log(`WebSocket: reconnexion dans ${RECONNECT_DELAY_MS / 1000}s`);
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (this.isExplicitlyClosed || this.socket) return;

      if (this.token && isExpired(this.token)) {
        const freshToken = await refreshAccessToken();
        if (this.isExplicitlyClosed) return;
        if (!freshToken) {
          // Offline or refresh failing: try again later. A rejected refresh token signs the
          // user out, which calls disconnect().
          this.scheduleReconnect();
          return;
        }
        this.token = freshToken;
      }
      this.open();
    }, RECONNECT_DELAY_MS);
  }
}

export const socketService = new SocketService();
