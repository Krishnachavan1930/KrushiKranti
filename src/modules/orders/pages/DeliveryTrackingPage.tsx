import { useParams, Link } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiShoppingBagLine,
    RiCheckboxCircleLine,
    RiTruckLine,
    RiMapPinLine,
    RiCheckDoubleLine,
    RiPhoneLine,
    RiUserLine,
    RiCalendarLine,
    RiInformationLine,
} from 'react-icons/ri';

// ── Types ────────────────────────────────────────────────────────────────────
type TrackingStep = {
    key: string;
    label: string;
    description: string;
    responsible: string;
    icon: React.ElementType;
    timestamp: string | null;
    done: boolean;
};

// ── Mock order ───────────────────────────────────────────────────────────────
const MOCK_ORDER = {
    id: 'ORD-001',
    product: 'Organic Tomatoes',
    qty: '5 kg',
    price: '₹40/kg',
    total: 200,
    orderDate: '1 Mar 2026, 9:30 AM',
    estimatedDelivery: '5 Mar 2026',
    deliveryAddress: '12, Shivaji Nagar, Pune, Maharashtra – 411005',
    partner: {
        name: 'Ramesh Delivery',
        phone: '+91 98765 12345',
        vehicle: 'MH-12-AB-1234',
    },
    currentStep: 3,   // 0-indexed
    steps: [
        {
            key: 'placed',
            label: 'Order Placed',
            description: 'Your order has been placed successfully.',
            responsible: 'You (Customer)',
            icon: RiShoppingBagLine,
            timestamp: '1 Mar 2026, 9:30 AM',
            done: true,
        },
        {
            key: 'confirmed',
            label: 'Order Confirmed',
            description: 'Farmer has confirmed and accepted your order.',
            responsible: 'Farmer',
            icon: RiCheckboxCircleLine,
            timestamp: '1 Mar 2026, 11:00 AM',
            done: true,
        },
        {
            key: 'shipped',
            label: 'Shipped',
            description: 'Order has been picked up and is in transit.',
            responsible: 'Farmer / Wholesaler',
            icon: RiTruckLine,
            timestamp: '2 Mar 2026, 8:00 AM',
            done: true,
        },
        {
            key: 'out_for_delivery',
            label: 'Out for Delivery',
            description: 'Delivery partner is on the way to your location.',
            responsible: 'Delivery Partner',
            icon: RiMapPinLine,
            timestamp: '4 Mar 2026, 7:00 AM',
            done: true,
        },
        {
            key: 'delivered',
            label: 'Delivered',
            description: 'Order will be delivered to your address.',
            responsible: 'Delivery Partner',
            icon: RiCheckDoubleLine,
            timestamp: null,
            done: false,
        },
    ] as TrackingStep[],
};

export function DeliveryTrackingPage() {
    const { id } = useParams<{ id: string }>();
    const order = { ...MOCK_ORDER, id: id || MOCK_ORDER.id };
    const currentStep = order.currentStep;

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Back link */}
            <Link
                to="/orders"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
                <RiArrowLeftLine size={16} />
                Back to Orders
            </Link>

            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Delivery Tracking</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Order #{order.id} · {order.product}
                </p>
            </div>

            {/* Order summary card */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800">
                <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Product', value: order.product },
                        { label: 'Qty', value: order.qty },
                        { label: 'Total', value: `₹${order.total}` },
                        { label: 'Order Date', value: order.orderDate },
                    ].map((row) => (
                        <div key={row.label}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{row.label}</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{row.value}</p>
                        </div>
                    ))}
                </div>

                {/* Estimated delivery + current status */}
                <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <RiCalendarLine size={15} className="text-slate-400 shrink-0" />
                        <span>Estimated delivery: <strong className="text-slate-900 dark:text-white">{order.estimatedDelivery}</strong></span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                        <RiMapPinLine size={12} />
                        Out for Delivery
                    </span>
                </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Delivery Timeline</h3>

                <div className="relative">
                    {/* Vertical connector line */}
                    <div className="absolute left-[19px] top-5 bottom-5 w-px bg-slate-200 dark:bg-slate-700" />

                    <div className="space-y-5">
                        {order.steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = idx === currentStep;
                            const isFuture = idx > currentStep;

                            return (
                                <div key={step.key} className="flex items-start gap-4 relative">
                                    {/* Step icon */}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${step.done && !isActive
                                                ? 'bg-green-600 border-green-600 text-white'
                                                : isActive
                                                    ? 'bg-white dark:bg-gray-900 border-yellow-500 text-yellow-500'
                                                    : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'
                                            }`}
                                    >
                                        <Icon size={16} />
                                    </div>

                                    {/* Step content */}
                                    <div className="flex-1 pt-1 pb-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p
                                                className={`text-sm font-semibold ${isFuture
                                                        ? 'text-slate-400 dark:text-slate-600'
                                                        : 'text-slate-900 dark:text-white'
                                                    }`}
                                            >
                                                {step.label}
                                            </p>
                                            {isActive && (
                                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        <p className={`text-xs mt-0.5 ${isFuture ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {step.description}
                                        </p>

                                        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                                            {step.timestamp && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <RiCalendarLine size={10} />
                                                    {step.timestamp}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <RiUserLine size={10} />
                                                {step.responsible}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Delivery Partner + Address */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                        <RiUserLine size={12} /> Delivery Partner
                    </h3>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{order.partner.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{order.partner.vehicle}</p>
                    <a
                        href={`tel:${order.partner.phone}`}
                        className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 mt-3"
                    >
                        <RiPhoneLine size={14} />
                        {order.partner.phone}
                    </a>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                        <RiMapPinLine size={12} /> Delivery Address
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {order.deliveryAddress}
                    </p>
                </div>
            </div>

            {/* Responsibility note */}
            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
                <RiInformationLine size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Status Responsibilities:</strong> Order confirmation is updated by the Farmer. Shipping status is updated by the Farmer or Wholesaler. Out-for-delivery and final delivery are updated by the Delivery Partner.
                </p>
            </div>
        </div>
    );
}
