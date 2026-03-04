import { Link } from 'react-router-dom';
import {
  RiArrowRightSLine,
  RiArrowUpLine,
  RiShoppingBagLine,
  RiPlantLine,
  RiAlertLine,
  RiEditLine,
  RiDeleteBinLine,
  RiAddLine,
} from 'react-icons/ri';
import { useAppSelector } from '../../../shared/hooks';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Oct', revenue: 12000 },
  { month: 'Nov', revenue: 18000 },
  { month: 'Dec', revenue: 15000 },
  { month: 'Jan', revenue: 22000 },
  { month: 'Feb', revenue: 28000 },
  { month: 'Mar', revenue: 25000 },
];
const orderData = [
  { month: 'Oct', orders: 12 },
  { month: 'Nov', orders: 19 },
  { month: 'Dec', orders: 15 },
  { month: 'Jan', orders: 25 },
  { month: 'Feb', orders: 30 },
  { month: 'Mar', orders: 27 },
];

const incomingOrders = [
  { id: 'ORD-201', buyer: 'Priya Sharma', product: 'Organic Tomatoes', qty: '10 kg', amount: 400, status: 'pending' },
  { id: 'ORD-202', buyer: 'Amit Patel', product: 'Fresh Spinach', qty: '5 kg', amount: 150, status: 'processing' },
  { id: 'ORD-203', buyer: 'Ravi Kumar', product: 'Basmati Rice', qty: '20 kg', amount: 1100, status: 'shipped' },
  { id: 'ORD-204', buyer: 'Sneha Joshi', product: 'Green Chillies', qty: '3 kg', amount: 90, status: 'delivered' },
];

const myProducts = [
  { id: '1', name: 'Organic Tomatoes', stock: 80, unit: 'kg', price: 40, alert: false },
  { id: '2', name: 'Fresh Spinach', stock: 12, unit: 'kg', price: 30, alert: true },
  { id: '3', name: 'Basmati Rice', stock: 0, unit: 'kg', price: 55, alert: true },
  { id: '4', name: 'Green Chillies', stock: 45, unit: 'kg', price: 30, alert: false },
];

const statusColors: Record<string, string> = {
  pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  processing: 'text-blue-700   bg-blue-50   border-blue-200',
  shipped: 'text-violet-700 bg-violet-50 border-violet-200',
  delivered: 'text-green-700  bg-green-50  border-green-200',
  cancelled: 'text-red-700    bg-red-50    border-red-200',
};

export function FarmerDashboardPage() {
  const { stats } = useAppSelector((state) => state.farmer);
  const lowStock = myProducts.filter((p) => p.alert);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Farmer Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage products, orders, and revenue.</p>
        </div>
        <Link
          to="/farmer/products/add"
          className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 text-white px-3 py-2 rounded-md"
        >
          <RiAddLine size={14} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, sub: '+15% growth', icon: RiArrowUpLine },
          { label: 'Total Orders', value: String(stats.totalOrders), sub: 'Fulfilled orders', icon: RiShoppingBagLine },
          { label: 'Active Products', value: String(stats.totalProducts), sub: 'In inventory', icon: RiPlantLine },
          { label: 'Stock Alerts', value: String(lowStock.length), sub: 'Need restocking', icon: RiAlertLine },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-medium text-slate-400">{s.sub}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stock Alerts Banner (only when there are alerts) */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg px-5 py-3 flex items-center gap-3">
          <RiAlertLine size={16} className="text-yellow-600 shrink-0" />
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
            {lowStock.length} product{lowStock.length > 1 ? 's' : ''} need restocking:
          </span>
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            {lowStock.map((p) => p.name).join(', ')}
          </span>
          <Link to="/farmer/products" className="ml-auto text-xs font-semibold text-yellow-700 dark:text-yellow-400 shrink-0">
            Manage
          </Link>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">Revenue (6 months)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px' }} formatter={(v) => [`₹${v}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">Orders (6 months)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px' }} />
                <Bar dataKey="orders" fill="#eab308" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Products Table + Incoming Orders */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Product Inventory */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">My Products</h3>
            <Link to="/farmer/products" className="flex items-center gap-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              Manage <RiArrowRightSLine size={14} />
            </Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Product', 'Stock', 'Price', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {myProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                    {p.alert && (
                      <span className="text-[10px] text-yellow-700 dark:text-yellow-400 font-semibold">
                        {p.stock === 0 ? 'Out of stock' : 'Low stock'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 tabular-nums">{p.stock} {p.unit}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">₹{p.price}/{p.unit}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Link to={`/farmer/products/edit/${p.id}`} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                        <RiEditLine size={14} />
                      </Link>
                      <button className="text-slate-400 hover:text-red-600">
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Incoming Orders */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Incoming Orders</h3>
            <Link to="/farmer/orders" className="flex items-center gap-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              View all <RiArrowRightSLine size={14} />
            </Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Buyer', 'Product', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {incomingOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">{o.buyer}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{o.product}</p>
                    <p className="text-[10px] text-slate-400">{o.qty}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">₹{o.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-semibold capitalize ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
