import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    RiShoppingBagLine,
    RiTruckLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiTimeLine,
    RiFileListLine,
    RiFilterLine,
    RiArrowRightLine,
    RiArrowLeftLine,
    RiArrowRightSLine,
    RiArrowLeftSLine,
    RiInboxUnarchiveLine,
    RiLoader4Line,
} from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchOrders, setFilters, setPage, cancelOrder } from '../orderSlice';
import type { OrderStatus } from '../types';
import toast from 'react-hot-toast';

// ── Status configuration ─────────────────────────────────────────────────────
const STATUS_META: Record<
    OrderStatus,
    { label: string; icon: React.ElementType; badgeClass: string; dotClass: string }
> = {
    pending: {
        label: 'Pending',
        icon: RiTimeLine,
        badgeClass: 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        dotClass: 'bg-yellow-400',
    },
    processing: {
        label: 'Confirmed',
        icon: RiFileListLine,
        badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        dotClass: 'bg-blue-400',
    },
    shipped: {
        label: 'Shipped',
        icon: RiTruckLine,
        badgeClass: 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
        dotClass: 'bg-purple-400',
    },
    delivered: {
        label: 'Delivered',
        icon: RiCheckboxCircleLine,
        badgeClass: 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        dotClass: 'bg-green-500',
    },
    cancelled: {
        label: 'Cancelled',
        icon: RiCloseCircleLine,
        badgeClass: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        dotClass: 'bg-red-400',
    },
};

// ── Timeline steps ───────────────────────────────────────────────────────────
const TIMELINE_STEPS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];
const STEP_ORDER: Record<OrderStatus, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1,
};

function OrderTimeline({ status }: { status: OrderStatus }) {
    const currentStep = STEP_ORDER[status];
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-xs font-semibold">
                <RiCloseCircleLine size={15} />
                Order Cancelled
            </div>
        );
    }
    return (
        <div className="flex items-center gap-0">
            {TIMELINE_STEPS.map((step, idx) => {
                const meta = STATUS_META[step];
                const Icon = meta.icon;
                const isCompleted = idx <= currentStep;
                const isActive = idx === currentStep;
                return (
                    <div key={step} className="flex items-center">
                        <div
                            className={`flex flex-col items-center gap-0.5 ${isActive
                                ? 'text-green-600 dark:text-green-400'
                                : isCompleted
                                    ? 'text-green-500 dark:text-green-500'
                                    : 'text-slate-300 dark:text-slate-700'
                                }`}
                        >
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${isActive
                                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                    : isCompleted
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900'
                                    }`}
                            >
                                <Icon size={13} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wide whitespace-nowrap hidden sm:block">
                                {meta.label}
                            </span>
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && (
                            <div
                                className={`h-0.5 w-8 sm:w-12 mx-0.5 mb-3 rounded-full ${idx < currentStep
                                    ? 'bg-green-500'
                                    : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Filter button labels ─────────────────────────────────────────────────────
const FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

// ── Main Page ────────────────────────────────────────────────────────────────
export function MyOrdersPage() {
    const dispatch = useAppDispatch();
    const { orders, filters, pagination, isLoading, error } = useAppSelector(
        (state) => state.orders
    );
    const [cancelModalId, setCancelModalId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(
            fetchOrders({
                status: filters.status,
                page: pagination.page,
                limit: pagination.limit,
            })
        );
    }, [dispatch, filters.status, pagination.page, pagination.limit]);

    const handleStatusChange = (status: OrderStatus | 'all') => {
        dispatch(setFilters({ status }));
    };

    const handleCancelOrder = async (id: string) => {
        const result = await dispatch(cancelOrder(id));
        if (cancelOrder.fulfilled.match(result)) {
            toast.success('Order cancelled successfully');
            setCancelModalId(null);
        } else {
            toast.error('Failed to cancel order');
        }
    };

    // ── Loading skeleton ────────────────────────────────────────────────────
    if (isLoading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 py-8 px-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="h-9 w-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-52 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
            {/* Page header */}
            <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <RiShoppingBagLine size={18} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                My Orders
                            </h1>
                            <p className="text-xs text-slate-400">
                                {pagination.total} order{pagination.total !== 1 ? 's' : ''} total
                            </p>
                        </div>
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <RiFilterLine size={14} className="text-slate-400 shrink-0" />
                        <div className="flex gap-1 flex-wrap">
                            {FILTER_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatusChange(opt.value)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-none ${filters.status === opt.value
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading overlay */}
                {isLoading && orders.length > 0 && (
                    <div className="flex justify-center py-2 mb-4">
                        <RiLoader4Line size={20} className="text-green-600 animate-spin" />
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && orders.length === 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center">
                        <RiInboxUnarchiveLine
                            size={56}
                            className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
                        />
                        <h2 className="text-lg font-bold text-slate-700 dark:text-white mb-2">
                            No orders found
                        </h2>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            {filters.status === 'all'
                                ? "You haven't placed any orders yet."
                                : `No ${filters.status} orders found.`}
                        </p>
                    </div>
                )}

                {/* Order cards */}
                <div className="space-y-4">
                    {orders.map((order) => {
                        const meta = STATUS_META[order.status];
                        const StatusIcon = meta.icon;
                        const isExpanded = expandedId === order.id;

                        return (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                            >
                                {/* Card header */}
                                <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                        {/* Order ID + Date */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                                <RiShoppingBagLine
                                                    size={18}
                                                    className="text-green-600 dark:text-green-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {order.id}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(order.createdAt).toLocaleDateString(
                                                        'en-IN',
                                                        { dateStyle: 'long' }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status badge + Total */}
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badgeClass}`}
                                            >
                                                <StatusIcon size={12} />
                                                {meta.label}
                                            </span>
                                            <span className="text-lg font-extrabold text-green-700 dark:text-green-400">
                                                ₹{order.totalAmount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product preview row */}
                                <div className="px-5 py-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center gap-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-slate-800"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display =
                                                            'none';
                                                    }}
                                                />
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {item.quantity} {item.unit} × ₹{item.price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <span className="text-xs text-slate-400 font-medium">
                                                +{order.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="px-5 pb-4">
                                    <OrderTimeline status={order.status} />
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                                        {/* All items */}
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                                Order Items
                                            </p>
                                            <div className="space-y-2">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-14 h-14 rounded-lg object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                Qty: {item.quantity} {item.unit} · ₹{item.price}/{item.unit}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping + Payment */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                                                    <RiTruckLine size={12} /> Shipping Address
                                                </p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                                                    <RiFileListLine size={12} /> Payment
                                                </p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    Method:{' '}
                                                    <span className="font-semibold">{order.paymentMethod}</span>
                                                </p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    Status:{' '}
                                                    <span className="font-semibold capitalize text-green-600 dark:text-green-400">
                                                        {order.paymentStatus}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions row */}
                                <div className="px-5 pb-5 flex flex-wrap items-center gap-3 pt-1">
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                        className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-lg"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <RiArrowLeftLine size={13} /> Hide Details
                                            </>
                                        ) : (
                                            <>
                                                View Details <RiArrowRightLine size={13} />
                                            </>
                                        )}
                                    </button>

                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => setCancelModalId(order.id)}
                                            className="text-xs font-semibold text-red-500 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {(order.status === 'shipped' || order.status === 'processing') && (
                                        <Link
                                            to={`/orders/${order.id}/track`}
                                            className="flex items-center gap-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 px-3 py-1.5 rounded-lg"
                                        >
                                            <RiTruckLine size={13} /> Track Order
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => dispatch(setPage(pagination.page - 1))}
                            disabled={pagination.page === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30"
                        >
                            <RiArrowLeftSLine size={18} />
                        </button>
                        {Array.from({ length: pagination.totalPages }).map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => dispatch(setPage(i + 1))}
                                className={`w-9 h-9 rounded-lg font-bold text-sm ${pagination.page === i + 1
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => dispatch(setPage(pagination.page + 1))}
                            disabled={pagination.page === pagination.totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30"
                        >
                            <RiArrowRightSLine size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelModalId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <RiCloseCircleLine size={28} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">
                            Cancel Order?
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                            Are you sure you want to cancel order{' '}
                            <span className="font-bold text-slate-900 dark:text-white">
                                #{cancelModalId}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelModalId(null)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm"
                            >
                                Keep It
                            </button>
                            <button
                                onClick={() => handleCancelOrder(cancelModalId)}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
