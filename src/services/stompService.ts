import SockJS from 'sockjs-client/dist/sockjs';
import { Client, type IMessage } from '@stomp/stompjs';
import { store } from '../app/store';
import { addRealtimeMessage } from '../modules/bulk/negotiationSlice';
import type { NegotiationMessage } from '../modules/bulk/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080';

class StompService {
    private client: Client | null = null;
    private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.client?.connected) {
                resolve();
                return;
            }

            this.client = new Client({
                webSocketFactory: () => new SockJS(`${WS_URL}/ws`),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                    if (import.meta.env.DEV) {
                        console.log('[STOMP]', str);
                    }
                },
                onConnect: () => {
                    console.log('[STOMP] Connected');
                    resolve();
                },
                onStompError: (frame) => {
                    console.error('[STOMP] Error:', frame.headers['message']);
                    reject(new Error(frame.headers['message']));
                },
                onDisconnect: () => {
                    console.log('[STOMP] Disconnected');
                },
            });

            this.client.activate();
        });
    }

    subscribeToConversation(conversationId: number): void {
        const destination = `/topic/negotiation/${conversationId}`;

        // Avoid duplicate subscriptions
        if (this.subscriptions.has(destination)) return;

        if (!this.client?.connected) {
            console.warn('[STOMP] Not connected, cannot subscribe');
            return;
        }

        const subscription = this.client.subscribe(destination, (message: IMessage) => {
            try {
                const msg: NegotiationMessage = JSON.parse(message.body);
                store.dispatch(addRealtimeMessage(msg));
            } catch (e) {
                console.error('[STOMP] Failed to parse message:', e);
            }
        });

        this.subscriptions.set(destination, subscription);
        console.log('[STOMP] Subscribed to:', destination);
    }

    unsubscribeFromConversation(conversationId: number): void {
        const destination = `/topic/negotiation/${conversationId}`;
        const sub = this.subscriptions.get(destination);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(destination);
            console.log('[STOMP] Unsubscribed from:', destination);
        }
    }

    sendMessage(conversationId: number, message: string, messageType: string = 'TEXT'): void {
        if (!this.client?.connected) {
            console.warn('[STOMP] Not connected, cannot send message');
            return;
        }

        this.client.publish({
            destination: '/app/negotiation.send',
            body: JSON.stringify({
                conversationId,
                message,
                messageType,
            }),
        });
    }

    disconnect(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.clear();

        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
    }

    get isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}

export const stompService = new StompService();
