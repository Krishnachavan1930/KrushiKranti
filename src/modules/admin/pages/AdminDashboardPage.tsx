import { Link } from 'react-router-dom';
import {
  RiArrowRightSLine,
  RiArrowUpLine,
  RiUserLine,
  RiPlantLine,
  RiShoppingBagLine,
  RiShieldLine,
  RiPercentLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiAlertLine,
  RiTimeLine,
} from 'react-icons/ri';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Mock data ────────────────────────────────────────────────────────────────
const revenueData = [
  { month: 'Oct', revenue: 85000 },
  { month: 'Nov', revenue: 92000 },
  { month: 'Dec', revenue: 110000 },
  { month: 'Jan', revenue: 135000 },
  { month: 'Feb', revenue: 158000 },
  { month: 'Mar', revenue: 182000 },
];

const userGrowthData = [
  { month: 'Oct', users: 150, farmers: 45 },
  { month: 'Nov', users: 180, farmers: 52 },
  { month: 'Dec', users: 220, farmers: 58 },
  { month: 'Jan', users: 280, farmers: 65 },
  { month: 'Feb', users: 350, farmers: 78 },
  { month: 'Mar', users: 420, farmers: 92 },
];

const fraudAlerts = [
  { id: 'FA-001', type: 'Suspicious pricing', user: 'Vikram Singh', severity: 'high', time: '2m ago' },
  { id: 'FA-002', type: 'Unusual transaction', user: 'Mohan Lal', severity: 'medium', time: '15m ago' },
  { id: 'FA-003', type: 'Multiple account attempt', user: 'Unknown', severity: 'high', time: '1h ago' },
];

const commissions = [
  { category: 'Consumer Orders', rate: '2%', earned: '₹15,240' },
  { category: 'Wholesale / Agent', rate: '5%', earned: '₹42,800' },
  { category: 'Farmer Platform Fee', rate: '3%', earned: '₹27,350' },
];

const pendingProducts = [
  { name: 'Organic Mangoes', farmer: 'Ramesh Patel', category: 'Fruits' },
  { name: 'Fresh Carrots', farmer: 'Sunita Devi', category: 'Vegetables' },
  { name: 'Premium Wheat', farmer: 'Anil Kumar', category: 'Grains' },
];

const recentLogs = [
  { action: 'User banned', detail: 'Vikram Singh', time: '2m ago', color: 'text-red-500' },
  { action: 'Product approved', detail: 'Fresh Spinach by Anil', time: '15m ago', color: 'text-green-600' },
  { action: 'Farmer joined', detail: 'Ramesh Sharma, Pune', time: '1h ago', color: 'text-green-600' },
  { action: 'Commission updated', detail: '5% → 6% for Agents', time: '3h ago', color: 'text-yellow-600' },
  { action: 'Bulk request flagged', detail: 'BR-089 by Wholesale Co.', time: '5h ago', color: 'text-orange-500' },
];

const manageUsers = [
  { name: 'Priya Sharma', role: 'user', joined: '1 Mar 2026', status: 'active' },
  { name: 'Anil Kumar', role: 'farmer', joined: '28 Feb 2026', status: 'active' },
  { name: 'Vikram Singh', role: 'wholesaler', joined: '15 Feb 2026', status: 'banned' },
  { name: 'Lata Devi', role: 'farmer', joined: '10 Feb 2026', status: 'active' },
];

const ROLE_BADGE: Record<string, string> = {
  user: 'text-blue-700 bg-blue-50 border-blue-200',
  farmer: 'text-green-700 bg-green-50 border-green-200',
  wholesaler: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  admin: 'text-purple-700 bg-purple-50 border-purple-200',
};

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Full visibility and management of the KrushiKranti platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹7,62,000', sub: '+18% this month', icon: RiArrowUpLine },
          { label: 'Total Users', value: '1,420', sub: '+42 this month', icon: RiUserLine },
          { label: 'Active Products', value: '856', sub: '+24 this week', icon: RiPlantLine },
          { label: 'Total Orders', value: '2,990', sub: '+156 today', icon: RiShoppingBagLine },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-medium text-green-700 dark:text-green-400">{s.sub}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

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
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">User Growth</h3>
            <div className="flex items-center gap-3">
              {[{ label: 'Users', color: 'bg-blue-500' }, { label: 'Farmers', color: 'bg-green-600' }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                  <span className="text-[10px] text-slate-400 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px' }} />
                <Bar dataKey="users" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Users" />
                <Bar dataKey="farmers" fill="#16a34a" radius={[2, 2, 0, 0]} name="Farmers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fraud Alerts */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <RiShieldLine size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Fraud Detection Alerts</h3>
            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
              {fraudAlerts.length}
            </span>
          </div>
          <Link to="/admin/fraud" className="flex items-center gap-0.5 text-xs font-medium text-red-600 dark:text-red-400">
            View all <RiArrowRightSLine size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['ID', 'Alert Type', 'User', 'Severity', 'Time', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {fraudAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3 text-xs text-slate-400 font-mono">{a.id}</td>
                  <td className="px-5 py-3 text-sm text-slate-900 dark:text-white">{a.type}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{a.user}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-semibold ${a.severity === 'high'
                        ? 'text-red-700 bg-red-50 border-red-200'
                        : 'text-orange-700 bg-orange-50 border-orange-200'
                      }`}>
                      {a.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">{a.time}</td>
                  <td className="px-5 py-3">
                    <button className="text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-1 rounded">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3-col row: Pending Approvals + Commissions + Activity Logs */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pending Approvals */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <RiTimeLine size={14} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pending Approvals</h3>
            </div>
            <Link to="/admin/products" className="flex items-center gap-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
              All <RiArrowRightSLine size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {pendingProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.farmer} · {p.category}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="w-6 h-6 bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800 rounded flex items-center justify-center">
                    <RiCheckboxCircleLine size={12} />
                  </button>
                  <button className="w-6 h-6 bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800 rounded flex items-center justify-center">
                    <RiCloseLine size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Tracking */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <RiPercentLine size={14} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Commission Report</h3>
            </div>
            <Link to="/admin/commissions" className="flex items-center gap-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              Details <RiArrowRightSLine size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {commissions.map((c) => (
              <div key={c.category} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{c.category}</p>
                  <p className="text-[10px] text-slate-400">Rate: {c.rate}</p>
                </div>
                <span className="text-sm font-bold text-green-700 dark:text-green-400 tabular-nums">{c.earned}</span>
              </div>
            ))}
            <div className="px-5 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <p className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">Total (Mar 2026)</p>
              <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">₹85,390</span>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Activity Logs</h3>
            <Link to="/admin/logs" className="flex items-center gap-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              All <RiArrowRightSLine size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {recentLogs.map((log, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${log.color}`}>{log.action}</p>
                  <p className="text-[10px] text-slate-400 truncate">{log.detail}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <RiUserLine size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Users</h3>
          </div>
          <Link to="/admin/users" className="flex items-center gap-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            Manage all <RiArrowRightSLine size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Name', 'Role', 'Joined', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {manageUsers.map((u) => (
                <tr key={u.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-semibold capitalize ${ROLE_BADGE[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">{u.joined}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-semibold ${u.status === 'active'
                        ? 'text-green-700 bg-green-50 border-green-200'
                        : 'text-red-700 bg-red-50 border-red-200'
                      }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className={`text-xs font-medium border px-2 py-1 rounded ${u.status === 'active'
                        ? 'text-red-600 border-red-200 dark:border-red-800'
                        : 'text-green-600 border-green-200 dark:border-green-800'
                      }`}>
                      {u.status === 'active' ? 'Ban' : 'Unban'}
                    </button>
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
