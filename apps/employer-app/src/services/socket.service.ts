import { useChatStore } from '@/store/useChatStore';
import { transformIpBackendUrl } from '@/utils/api';

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

const API_URL = transformIpBackendUrl(RAW_API_HOST, 4000);

class SocketService {
  private socket: WebSocket | null = null;

  connect(token: string) {
    if (this.socket || !token) return;

    const wsUrl = API_URL.replace(/^http/, 'ws') + `/ws?token=${token}`;

    console.log('Tentative de connexion WebSocket sur :', wsUrl);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket Connecté avec succès !');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'MESSAGE' || data.content_text) {
            useChatStore.getState().addMessage(data);
          }
        } catch (e) {
          console.error("Erreur parsing WS", e);
        }
      };

      this.socket.onerror = (e: any) => {
        console.error('Erreur de connexion WebSocket. Vérifiez le port 4000 et votre Firewall.');
      };

      this.socket.onclose = (e) => {
        this.socket = null;
        console.log(`Socket déconnecté (Code: ${e.code}). Tentative dans 5s...`);
        if (e.code !== 1000) {
          setTimeout(() => this.connect(token), 5000);
        }
      };
    } catch (err) {
      console.error('Erreur fatale lors de la création du WebSocket', err);
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const socketService = new SocketService();
