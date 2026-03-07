import { useState, useEffect, useCallback } from 'react';
import {
    RiShoppingBagLine,
    RiSearchLine,
    RiRefreshLine,
    RiTruckLine,
    RiUserLine,
    RiMapPinLine,
} from 'react-icons/ri';
import api from '../../../services/api';
import { trackingService, type DeliveryOrder } from '../../orders/trackingService';

interface UserOption {
    id: number;
    name: string;
    email: string;
}

export function AdminOrdersPage() {
    const [orders, setOrders] = useState<DeliveryOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Users lookup for assignment
    const [users, setUsers] = useState<UserOption[]>([]);
    const [assigningOrderId, setAssigningOrderId] = useState<number | null>(null);
    const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
    const [notes, setNotes] = useState('');

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/v1/orders', { params: { page: 0, size: 50 } });
            setOrders(response.data.data.content || []);
        } catch (err) {
            setError((err as Error).message || 'Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            // Fetch all users to populate the delivery partner dropdown
            // (Assuming /v1/users exists and returns users list)
            const response = await api.get('/v1/users', { params: { role: 'user', size: 100 } });
            setUsers(response.data.data.content || []);
        } catch (err) {
            console.error('Failed to load users for assignment', err);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        fetchUsers();
    }, [fetchOrders, fetchUsers]);

    const handleAssignSubmit = async (orderId: number) => {
        if (!selectedPartnerId) return;

        try {
            await trackingService.assignDeliveryPartner(orderId, parseInt(selectedPartnerId, 10), notes);
            alert('Delivery partner assigned successfully!');
            setAssigningOrderId(null);
            setSelectedPartnerId('');
            setNotes('');
            fetchOrders();
        } catch (err) {
            alert((err as Error).message);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <RiShoppingBagLine size={24} className="text-purple-600" />
                        Manage Orders
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        View all platform orders and assign delivery partners
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <RiRefreshLine size={15} /> Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-lg">{error}</div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Order</th>
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</th>
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount</th>
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Delivery</th>
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {order.orderNumber || `#${order.id}`}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">{order.productName}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <RiUserLine size={14} className="text-slate-400" />
                                                {order.userName}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                            ₹{order.totalAmount || order.totalPrice}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold bg-blue-50 text-blue-700 border-blue-200">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            {order.deliveryPartnerName ? (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                                                        <RiTruckLine size={14} className="text-green-600" />
                                                        {order.deliveryPartnerName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Status: {order.deliveryStatus || 'PENDING'}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {assigningOrderId === order.id ? (
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <select
                                                        value={selectedPartnerId}
                                                        onChange={(e) => setSelectedPartnerId(e.target.value)}
                                                        className="text-sm border-slate-200 dark:border-slate-700 rounded-lg dark:bg-gray-800 dark:text-white px-2 py-1.5"
                                                    >
                                                        <option value="">Select Partner...</option>
                                                        {users.map((u) => (
                                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="Notes (optional)"
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        className="text-sm border-slate-200 dark:border-slate-700 rounded-lg dark:bg-gray-800 dark:text-white px-2 py-1.5"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAssignSubmit(order.id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setAssigningOrderId(null)}
                                                            className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setAssigningOrderId(order.id);
                                                        setSelectedPartnerId('');
                                                        setNotes('');
                                                    }}
                                                    className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700"
                                                >
                                                    {order.deliveryPartnerName ? 'Reassign' : 'Assign Partner'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
