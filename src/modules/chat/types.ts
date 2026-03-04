export type MessageType = 'text' | 'price_offer';
export type ConversationStatus = 'active' | 'agreed' | 'rejected';

export interface PriceOffer {
    productName: string;
    offeredPrice: number;
    unit: string;
    quantity: number;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    text: string;
    type: MessageType;
    priceOffer?: PriceOffer;
    timestamp: string;
    isRead: boolean;
}

export interface Participant {
    id: string;
    name: string;
    role: 'farmer' | 'wholesaler' | 'user' | 'admin' | 'agent';
    isOnline: boolean;
}

export interface Conversation {
    id: string;
    participants: Participant[];
    lastMessage?: Message;
    unreadCount: number;
    status: ConversationStatus;
    productContext?: string; // product being negotiated
}

export interface ChatState {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    isTyping: boolean;
}
