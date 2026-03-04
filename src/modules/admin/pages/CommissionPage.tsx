import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, Percent } from 'lucide-react';

// Mock commission data
const monthlyCommissions = [
  { month: 'Jan', commission: 42500, orders: 850 },
  { month: 'Feb', commission: 46000, orders: 920 },
  { month: 'Mar', commission: 55000, orders: 1100 },
  { month: 'Apr', commission: 67500, orders: 1350 },
  { month: 'May', commission: 79000, orders: 1580 },
  { month: 'Jun', commission: 91000, orders: 1820 },
];

const recentCommissions = [
  { id: '1', orderId: 'ORD-2024-001', orderAmount: 5000, commission: 250, farmerName: 'Ramesh Kumar', date: '2024-01-25' },
  { id: '2', orderId: 'ORD-2024-002', orderAmount: 12000, commission: 600, farmerName: 'Suresh Patel', date: '2024-01-25' },
  { id: '3', orderId: 'ORD-2024-003', orderAmount: 3500, commission: 175, farmerName: 'Mahesh Yadav', date: '2024-01-24' },
  { id: '4', orderId: 'ORD-2024-004', orderAmount: 8200, commission: 410, farmerName: 'Prakash Deshmukh', date: '2024-01-24' },
  { id: '5', orderId: 'ORD-2024-005', orderAmount: 15000, commission: 750, farmerName: 'Anil Sharma', date: '2024-01-24' },
  { id: '6', orderId: 'ORD-2024-006', orderAmount: 6500, commission: 325, farmerName: 'Vikram Singh', date: '2024-01-23' },
  { id: '7', orderId: 'ORD-2024-007', orderAmount: 9800, commission: 490, farmerName: 'Ramesh Kumar', date: '2024-01-23' },
  { id: '8', orderId: 'ORD-2024-008', orderAmount: 4200, commission: 210, farmerName: 'Meena Devi', date: '2024-01-22' },
];

const totalEarnings = monthlyCommissions.reduce((acc, curr) => acc + curr.commission, 0);
const totalOrders = monthlyCommissions.reduce((acc, curr) => acc + curr.orders, 0);
const avgCommission = Math.round(totalEarnings / totalOrders);

export function CommissionPage() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Commission Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">Platform earnings and revenue breakdown</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <IndianRupee size={20} />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">+14% vs last mo</span>
          </div>
          <p className="text-green-100 text-xs uppercase font-medium">Platform Earnings</p>
          <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Percent className="text-yellow-600" size={20} />
            </div>
            <span className="text-xs font-medium text-green-600">5% Rate</span>
          </div>
          <p className="text-gray-500 text-xs uppercase font-medium">Avg Commission/Order</p>
          <p className="text-2xl font-bold text-gray-900">₹{avgCommission}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <span className="text-xs font-medium text-green-600">+12%</span>
          </div>
          <p className="text-gray-500 text-xs uppercase font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</p>
        </div>
      </div>

      {/* Monthly Breakdown Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Commission Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCommissions}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="commission" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commission Per Order Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Commission Per Order</h3>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Farmer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-green-800 uppercase">Order Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-green-800 uppercase">Commission (5%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentCommissions.map(comm => (
                <tr key={comm.id}>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">{comm.orderId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{comm.farmerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(comm.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{comm.orderAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right">₹{comm.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {recentCommissions.map(comm => (
            <div key={comm.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600">{comm.orderId}</span>
                <span className="text-xs text-gray-500">{new Date(comm.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{comm.farmerName}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Order: ₹{comm.orderAmount.toLocaleString()}</span>
                <span className="text-sm font-semibold text-green-600">Commission: ₹{comm.commission}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
