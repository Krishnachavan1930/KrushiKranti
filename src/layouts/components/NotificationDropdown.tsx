import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, CheckCircle, MessageSquare, Star, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
    markAsRead,
    markAllAsRead,
    type NotificationType,
} from '../../modules/notifications/notificationSlice';

const typeIcon: Record<NotificationType, React.ElementType> = {
    order_placed: ShoppingBag,
    product_approved: CheckCircle,
    bulk_request: Package,
    price_negotiation: MessageSquare,
    new_review: Star,
};

const typeColor: Record<NotificationType, string> = {
    order_placed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    product_approved: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    bulk_request: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    price_negotiation: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    new_review: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notifications = useAppSelector((state) => state.notifications.notifications);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (id: string, link?: string) => {
        dispatch(markAsRead(id));
        setIsOpen(false);
        if (link) navigate(link);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 transition-none relative"
                title="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border border-white dark:border-gray-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[200]">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => dispatch(markAllAsRead())}
                                className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-xs text-slate-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const Icon = typeIcon[notif.type];
                                const colorClass = typeColor[notif.type];
                                return (
                                    <button
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif.id, notif.link)}
                                        className={`w-full text-left p-3 flex gap-3 transition-colors ${notif.isRead
                                                ? 'bg-white dark:bg-gray-900'
                                                : 'bg-green-50/50 dark:bg-green-900/10'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                                            <Icon size={14} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-[11px] leading-snug ${notif.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-semibold'}`}>
                                                {notif.message}
                                            </p>
                                            <span className="text-[9px] text-slate-400 mt-1 block uppercase font-bold">
                                                {notif.time}
                                            </span>
                                        </div>
                                        {!notif.isRead && (
                                            <span className="w-2 h-2 bg-green-500 rounded-full shrink-0 mt-1.5" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
