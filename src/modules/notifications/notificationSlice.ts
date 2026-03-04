import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationType =
    | 'order_placed'
    | 'product_approved'
    | 'bulk_request'
    | 'price_negotiation'
    | 'new_review';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    time: string;
    isRead: boolean;
    link?: string;
}

interface NotificationState {
    notifications: Notification[];
}

const dummyNotifications: Notification[] = [
    {
        id: 'notif_1',
        type: 'order_placed',
        message: 'Your order #ORD-123456 has been placed successfully.',
        time: '2m ago',
        isRead: false,
        link: '/orders',
    },
    {
        id: 'notif_2',
        type: 'product_approved',
        message: 'Your product "Alphonso Mangoes" has been approved by admin.',
        time: '1h ago',
        isRead: false,
        link: '/farmer/products',
    },
    {
        id: 'notif_3',
        type: 'bulk_request',
        message: 'New bulk order request received for 500kg of Basmati Rice.',
        time: '3h ago',
        isRead: false,
        link: '/wholesaler/bulk-orders',
    },
    {
        id: 'notif_4',
        type: 'price_negotiation',
        message: 'Ramesh Kumar sent a price negotiation on Fresh Tomatoes.',
        time: '5h ago',
        isRead: true,
        link: '/chat',
    },
    {
        id: 'notif_5',
        type: 'new_review',
        message: 'You received a 5★ review on your product "Toor Dal".',
        time: '1d ago',
        isRead: true,
        link: '/farmer/products',
    },
];

const initialState: NotificationState = {
    notifications: dummyNotifications,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        markAsRead: (state, action: PayloadAction<string>) => {
            const notif = state.notifications.find((n) => n.id === action.payload);
            if (notif) notif.isRead = true;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((n) => (n.isRead = true));
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
        },
    },
});

export const { markAsRead, markAllAsRead, clearNotifications, addNotification } =
    notificationSlice.actions;
export default notificationSlice.reducer;
