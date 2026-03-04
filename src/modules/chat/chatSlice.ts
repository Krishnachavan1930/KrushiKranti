import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Conversation, Message } from './types';

const initialState: ChatState = {
    conversations: [],
    activeConversation: null,
    messages: [],
    isLoading: false,
    error: null,
    isTyping: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setActiveConversation: (state, action: PayloadAction<Conversation | null>) => {
            state.activeConversation = action.payload;
            // Mark as read
            if (action.payload) {
                const idx = state.conversations.findIndex(c => c.id === action.payload!.id);
                if (idx !== -1) state.conversations[idx].unreadCount = 0;
            }
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            // Prevent duplicate messages
            const exists = state.messages.some(m => m.id === action.payload.id);
            if (exists) return;
            state.messages.push(action.payload);
            // Update conversation last message
            const convIdx = state.conversations.findIndex(c => c.id === state.activeConversation?.id);
            if (convIdx !== -1) {
                state.conversations[convIdx].lastMessage = action.payload;
            }
        },
        updatePriceOfferStatus: (
            state,
            action: PayloadAction<{ messageId: string; status: 'accepted' | 'rejected' }>
        ) => {
            const msg = state.messages.find(m => m.id === action.payload.messageId);
            if (msg?.priceOffer) {
                msg.priceOffer.status = action.payload.status;
            }
            // Update conversation status if accepted
            if (action.payload.status === 'accepted' && state.activeConversation) {
                const convIdx = state.conversations.findIndex(c => c.id === state.activeConversation!.id);
                if (convIdx !== -1) state.conversations[convIdx].status = 'agreed';
                if (state.activeConversation) state.activeConversation.status = 'agreed';
            }
        },
        setTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setConversations,
    setActiveConversation,
    setMessages,
    addMessage,
    updatePriceOfferStatus,
    setTyping,
    setLoading,
    setError,
} = chatSlice.actions;

export default chatSlice.reducer;
