import { useChatStore } from '@koudmain/ui/store/useChatStore';
import { transformIpBackendUrl } from '@koudmain/ui/utils/api';

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

const API_URL = transformIpBackendUrl(RAW_API_HOST, 4000);

class SocketService {
  private socket: WebSocket | null = null;
  private isExplicitlyClosed = false;

  connect(token: string) {
    if (this.socket || !token) {
      console.log('WebSocket: connexion ignorée (socket déjà ouverte ou token manquant)');
      return;
    }

    this.isExplicitlyClosed = false;

    const wsUrl = API_URL.replace(/^http/, 'ws') + `/ws?token=${token}`;

    console.log('Tentative de connexion WebSocket sur :', wsUrl);

    try {
      this.socket = new WebSocket(wsUrl);

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

      this.socket.onerror = (e: any) => {
        console.error('WebSocket: erreur de connexion', e);
      };

      this.socket.onclose = (e) => {
        this.socket = null;
        if (!this.isExplicitlyClosed && e.code !== 1000) {
          console.log('WebSocket: reconnexion dans 5s');
          setTimeout(() => this.connect(token), 5000);
        }
      };
    } catch (err) {
      console.error('WebSocket: erreur fatale lors de la création', err);
    }
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    this.socket?.close();
    this.socket = null;
  }
}

export const socketService = new SocketService();
