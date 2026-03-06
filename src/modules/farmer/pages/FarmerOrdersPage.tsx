import { useState, useMemo } from 'react';
import {
    RiSearchLine,
    RiFilterLine,
    RiEyeLine,
    RiEditLine,
    RiMessage2Line,
    RiCloseLine,
    RiShoppingBagLine,
    RiTruckLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiTimeLine,
    RiFileListLine,
    RiMapPinLine,
    RiUserLine,
    RiArrowUpDownLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiPackageLine,
} from 'react-icons/ri';

/* ══════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════ */
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface FarmerOrder {
    id: string;
    product: string;
    productImage: string;
    buyer: string;
    buyerPhone: string;
    quantity: string;
    price: number;
    total: number;
    date: string;
    status: OrderStatus;
    address: string;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending' | 'failed';
}

/* ══════════════════════════════════════════════════════
   Mock data
══════════════════════════════════════════════════════ */
const MOCK_ORDERS: FarmerOrder[] = [
    { id: 'ORD-1001', product: 'Organic Tomatoes', productImage: 'https://images.unsplash.com/photo-1546470427-227c7a3e9853?w=80', buyer: 'Priya Sharma', buyerPhone: '+91 98765 43210', quantity: '15 kg', price: 60, total: 900, date: '05 Mar 2026', status: 'pending', address: '12, MG Road, Pune 411001', paymentMethod: 'UPI', paymentStatus: 'paid' },
    { id: 'ORD-1002', product: 'Fresh Spinach', productImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80', buyer: 'Amit Patel', buyerPhone: '+91 91234 56789', quantity: '8 kg', price: 40, total: 320, date: '04 Mar 2026', status: 'confirmed', address: '45, FC Road, Pune 411004', paymentMethod: 'Cash', paymentStatus: 'pending' },
    { id: 'ORD-1003', product: 'Basmati Rice', productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80', buyer: 'Ravi Kumar', buyerPhone: '+91 87654 32109', quantity: '30 kg', price: 120, total: 3600, date: '03 Mar 2026', status: 'shipped', address: '8, Koregaon Park, Pune 411001', paymentMethod: 'UPI', paymentStatus: 'paid' },
    { id: 'ORD-1004', product: 'Green Chillies', productImage: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=80', buyer: 'Sneha Joshi', buyerPhone: '+91 76543 21098', quantity: '5 kg', price: 30, total: 150, date: '02 Mar 2026', status: 'delivered', address: '3, Baner Road, Pune 411045', paymentMethod: 'Card', paymentStatus: 'paid' },
    { id: 'ORD-1005', product: 'Fresh Carrots', productImage: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80', buyer: 'Rahul Nair', buyerPhone: '+91 99887 76655', quantity: '10 kg', price: 28, total: 280, date: '01 Mar 2026', status: 'out_for_delivery', address: '78, Kothrud, Pune 411038', paymentMethod: 'UPI', paymentStatus: 'paid' },
    { id: 'ORD-1006', product: 'Organic Potatoes', productImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80', buyer: 'Deepa Menon', buyerPhone: '+91 88776 65544', quantity: '25 kg', price: 20, total: 500, date: '28 Feb 2026', status: 'cancelled', address: '22, Viman Nagar, Pune 411014', paymentMethod: 'Cash', paymentStatus: 'failed' },
    { id: 'ORD-1007', product: 'Turmeric Powder', productImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80', buyer: 'Arjun Singh', buyerPhone: '+91 77665 54433', quantity: '3 kg', price: 180, total: 540, date: '27 Feb 2026', status: 'confirmed', address: '9, Hadapsar, Pune 411028', paymentMethod: 'UPI', paymentStatus: 'paid' },
    { id: 'ORD-1008', product: 'Fresh Coriander', productImage: 'https://images.unsplash.com/photo-1605210055810-30c97db07e1e?w=80', buyer: 'Kavita Rao', buyerPhone: '+91 66554 43322', quantity: '2 kg', price: 50, total: 100, date: '26 Feb 2026', status: 'delivered', address: '55, Aundh, Pune 411007', paymentMethod: 'Card', paymentStatus: 'paid' },
];

/* ══════════════════════════════════════════════════════
   Status config
══════════════════════════════════════════════════════ */
const STATUS_META: Record<OrderStatus, { label: string; icon: React.ElementType; badge: string }> = {
    pending: { label: 'Pending', icon: RiTimeLine, badge: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800' },
    confirmed: { label: 'Confirmed', icon: RiFileListLine, badge: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800' },
    shipped: { label: 'Shipped', icon: RiTruckLine, badge: 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800' },
    out_for_delivery: { label: 'Out for Delivery', icon: RiPackageLine, badge: 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800' },
    delivered: { label: 'Delivered', icon: RiCheckboxCircleLine, badge: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800' },
    cancelled: { label: 'Cancelled', icon: RiCloseCircleLine, badge: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800' },
};

const TIMELINE_STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
const STEP_ORDER: Record<OrderStatus, number> = {
    pending: 0, confirmed: 1, shipped: 2, out_for_delivery: 3, delivered: 4, cancelled: -1,
};

/* ══════════════════════════════════════════════════════
   Summary stat card
══════════════════════════════════════════════════════ */
function StatCard({ label, value, icon: Icon, color, bg }: {
    label: string; value: number | string;
    icon: React.ElementType; color: string; bg: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={18} className={color} />
            </div>
            <div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   Order Timeline
══════════════════════════════════════════════════════ */
function OrderTimeline({ status }: { status: OrderStatus }) {
    const current = STEP_ORDER[status];
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
                <RiCloseCircleLine size={16} /> Order Cancelled
            </div>
        );
    }
    return (
        <div className="relative mt-2">
            {TIMELINE_STEPS.map((step, idx) => {
                const meta = STATUS_META[step];
                const Icon = meta.icon;
                const done = idx <= current;
                const active = idx === current;
                return (
                    <div key={step} className="flex items-start gap-3 mb-0">
                        <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${active ? 'border-green-600 bg-green-600 text-white'
                                : done ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-300'
                                }`}>
                                <Icon size={13} />
                            </div>
                            {idx < TIMELINE_STEPS.length - 1 && (
                                <div className={`w-0.5 h-6 mt-0.5 rounded-full ${idx < current ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            )}
                        </div>
                        <p className={`text-xs pt-1 font-semibold ${active ? 'text-green-600 dark:text-green-400' : done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`}>
                            {meta.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   Order Detail Modal
══════════════════════════════════════════════════════ */
function OrderModal({ order, onClose }: { order: FarmerOrder; onClose: () => void }) {
    const meta = STATUS_META[order.status];
    const Icon = meta.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-end bg-black/40 backdrop-blur-[2px]">
            <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-2xl">
                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{order.id}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <RiCloseLine size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status badge */}
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${meta.badge}`}>
                            <Icon size={12} />{meta.label}
                        </span>
                        <span className="text-xl font-extrabold text-green-700 dark:text-green-400">
                            ₹{order.total.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {/* Product */}
                    <section>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Product</p>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                            <img
                                src={order.productImage}
                                alt={order.product}
                                className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56'; }}
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{order.product}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{order.quantity} × ₹{order.price}/kg</p>
                            </div>
                        </div>
                    </section>

                    {/* Customer */}
                    <section>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Customer</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2.5">
                            <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                <RiUserLine size={14} className="text-slate-400 shrink-0" />
                                <span className="font-semibold">{order.buyer}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                <RiMessage2Line size={14} className="text-slate-400 shrink-0" />
                                <span>{order.buyerPhone}</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                <RiMapPinLine size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                <span>{order.address}</span>
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Payment</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400">Method</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{order.paymentMethod}</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${order.paymentStatus === 'paid'
                                ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                                : order.paymentStatus === 'pending'
                                    ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
                                    : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Order Timeline</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                            <OrderTimeline status={order.status} />
                        </div>
                    </section>
                </div>

                {/* Drawer footer actions */}
                <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <RiEditLine size={14} /> Update Status
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <RiMessage2Line size={14} /> Contact Buyer
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   Status badge component
══════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: OrderStatus }) {
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold whitespace-nowrap ${meta.badge}`}>
            <Icon size={10} />{meta.label}
        </span>
    );
}

/* ══════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════ */
const ALL_STATUSES: (OrderStatus | 'all')[] = [
    'all', 'pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled',
];

type SortKey = 'date' | 'total' | 'status';

export function FarmerOrdersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortAsc, setSortAsc] = useState(false);
    const [activeOrder, setActiveOrder] = useState<FarmerOrder | null>(null);

    /* ── Derived stats ── */
    const total = MOCK_ORDERS.length;
    const pending = MOCK_ORDERS.filter((o) => o.status === 'pending').length;
    const completed = MOCK_ORDERS.filter((o) => o.status === 'delivered').length;
    const cancelled = MOCK_ORDERS.filter((o) => o.status === 'cancelled').length;

    /* ── Filter + sort ── */
    const filtered = useMemo(() => {
        let list = MOCK_ORDERS.filter((o) => {
            const matchStatus = statusFilter === 'all' || o.status === statusFilter;
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                o.id.toLowerCase().includes(q) ||
                o.product.toLowerCase().includes(q) ||
                o.buyer.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });

        list = [...list].sort((a, b) => {
            let cmp = 0;
            if (sortKey === 'total') cmp = a.total - b.total;
            if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
            if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
            return sortAsc ? cmp : -cmp;
        });

        return list;
    }, [search, statusFilter, sortKey, sortAsc]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortAsc(!sortAsc);
        else { setSortKey(key); setSortAsc(false); }
    };

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col) return <RiArrowUpDownLine size={11} className="text-slate-300" />;
        return sortAsc
            ? <RiArrowUpSLine size={12} className="text-green-600" />
            : <RiArrowDownSLine size={12} className="text-green-600" />;
    }

    return (
        <div className="space-y-6">
            {/* ── Page heading ── */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Orders</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage incoming orders, update statuses, and contact buyers.
                </p>
            </div>

            {/* ── Summary cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={total} icon={RiShoppingBagLine} color="text-slate-600" bg="bg-slate-100 dark:bg-slate-800" />
                <StatCard label="Pending Orders" value={pending} icon={RiTimeLine} color="text-yellow-600" bg="bg-yellow-50 dark:bg-yellow-900/20" />
                <StatCard label="Completed" value={completed} icon={RiCheckboxCircleLine} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
                <StatCard label="Cancelled" value={cancelled} icon={RiCloseCircleLine} color="text-red-500" bg="bg-red-50 dark:bg-red-900/20" />
            </div>

            {/* ── Toolbar: search + status filter ── */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    {/* Search */}
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order ID, product or buyer…"
                            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Status filter pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <RiFilterLine size={13} className="text-slate-400 shrink-0" />
                        {ALL_STATUSES.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${statusFilter === s
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {s === 'all' ? 'All' : STATUS_META[s].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                {[
                                    { label: 'Order ID', key: null },
                                    { label: 'Product', key: null },
                                    { label: 'Buyer', key: null },
                                    { label: 'Quantity', key: null },
                                    { label: 'Price', key: null },
                                    { label: 'Total', key: 'total' as SortKey },
                                    { label: 'Date', key: 'date' as SortKey },
                                    { label: 'Status', key: 'status' as SortKey },
                                    { label: 'Actions', key: null },
                                ].map(({ label, key }) => (
                                    <th
                                        key={label}
                                        onClick={() => key && toggleSort(key)}
                                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap ${key ? 'cursor-pointer select-none hover:text-slate-600 dark:hover:text-slate-200' : ''}`}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {label}
                                            {key && <SortIcon col={key} />}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-16 text-center text-sm text-slate-400">
                                        No orders found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* Order ID */}
                                        <td className="px-4 py-3.5">
                                            <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{order.id}</p>
                                        </td>

                                        {/* Product */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={order.productImage}
                                                    alt={order.product}
                                                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/36';
                                                    }}
                                                />
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                                                    {order.product}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Buyer */}
                                        <td className="px-4 py-3.5">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">{order.buyer}</p>
                                        </td>

                                        {/* Quantity */}
                                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {order.quantity}
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            ₹{order.price}/kg
                                        </td>

                                        {/* Total */}
                                        <td className="px-4 py-3.5">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                                                ₹{order.total.toLocaleString('en-IN')}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {order.date}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            <StatusBadge status={order.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => setActiveOrder(order)}
                                                    title="View Details"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                                >
                                                    <RiEyeLine size={15} />
                                                </button>
                                                <button
                                                    title="Update Status"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                >
                                                    <RiEditLine size={15} />
                                                </button>
                                                <button
                                                    title="Contact Buyer"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                                                >
                                                    <RiMessage2Line size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer */}
                {filtered.length > 0 && (
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> of{' '}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span> orders
                        </p>
                        <p className="text-xs text-slate-400">
                            Total revenue:{' '}
                            <span className="font-bold text-green-700 dark:text-green-400">
                                ₹{filtered.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* ── Order Detail Drawer ── */}
            {activeOrder && (
                <OrderModal order={activeOrder} onClose={() => setActiveOrder(null)} />
            )}
        </div>
    );
}
