import { useChatStore } from '@koudmain/ui/store/useChatStore';
import { transformIpBackendUrl } from '@koudmain/ui/utils/api';

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

const API_URL = transformIpBackendUrl(RAW_API_HOST, 4000);

class SocketService {
  private socket: WebSocket | null = null;
  private isExplicitlyClosed = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(token: string) {
    if (!token) return;

    // Si une socket est déjà active ou en cours d'ouverture, ne rien faire
    if (this.socket) {
      if (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      ) {
        return;
      }
      this.disconnect();
    }

    this.isExplicitlyClosed = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const wsUrl = API_URL.replace(/^http/, 'ws') + `/ws?token=${token}`;

    try {
      const ws = new WebSocket(wsUrl);
      this.socket = ws;

      ws.onopen = () => {
        if (this.socket !== ws) return;
        console.log('WebSocket: connecté avec succès');
      };

      ws.onmessage = (event) => {
        if (this.socket !== ws) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'MESSAGE' || data.content_text) {
            useChatStore.getState().addMessage(data);
          }
        } catch (e) {
          console.warn('WebSocket: erreur parsing message JSON', e);
        }
      };

      ws.onerror = (e) => {
        if (this.isExplicitlyClosed || this.socket !== ws) return;
        console.warn(
          'WebSocket: problème de connexion au serveur (Go)',
          (e as { message?: string })?.message || '',
        );
      };

      ws.onclose = (e) => {
        if (this.socket === ws) {
          this.socket = null;
        }
        if (this.isExplicitlyClosed) return;

        // Reconnexion automatique si fermeture inattendue (autre que code normal 1000 / 1001)
        if (e.code !== 1000 && e.code !== 1001) {
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
          }
          this.reconnectTimer = setTimeout(() => {
            if (!this.isExplicitlyClosed) {
              this.connect(token);
            }
          }, 5000);
        }
      };
    } catch (err) {
      console.warn('WebSocket: échec lors de la création de la connexion', err);
    }
  }

  disconnect() {
    this.isExplicitlyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      const ws = this.socket;
      this.socket = null;

      // Détacher tous les listeners pour éviter les callbacks sur un socket en cours de destruction
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;

      try {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      } catch {
        // Ignorer si déjà fermé
      }
    }
  }
}

export const socketService = new SocketService();
