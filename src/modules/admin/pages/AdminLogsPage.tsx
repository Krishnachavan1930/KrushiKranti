import { useState } from 'react';
import { Search, Clock, User, Package, Shield, Ban, CheckCircle } from 'lucide-react';

// Mock activity logs
const mockLogs = [
  { id: '1', adminName: 'Super Admin', action: 'Banned User', target: 'Vikram Singh', timestamp: '2024-01-25T10:45:00', type: 'user' },
  { id: '2', adminName: 'Super Admin', action: 'Approved Product', target: 'Fresh Spinach', timestamp: '2024-01-25T10:30:00', type: 'product' },
  { id: '3', adminName: 'Moderator', action: 'Rejected Product', target: 'Low Quality Rice', timestamp: '2024-01-25T10:15:00', type: 'product' },
  { id: '4', adminName: 'Super Admin', action: 'Resolved Fraud Alert', target: 'Suspicious Pricing', timestamp: '2024-01-25T09:45:00', type: 'alert' },
  { id: '5', adminName: 'Moderator', action: 'Unbanned User', target: 'Priya Singh', timestamp: '2024-01-25T09:30:00', type: 'user' },
  { id: '6', adminName: 'Super Admin', action: 'Approved Product', target: 'Organic Tomatoes', timestamp: '2024-01-25T09:00:00', type: 'product' },
  { id: '7', adminName: 'Moderator', action: 'Banned User', target: 'Spam Account', timestamp: '2024-01-24T18:30:00', type: 'user' },
  { id: '8', adminName: 'Super Admin', action: 'Updated Commission Rate', target: '5% to 5.5%', timestamp: '2024-01-24T16:00:00', type: 'system' },
  { id: '9', adminName: 'Moderator', action: 'Approved Product', target: 'Premium Wheat', timestamp: '2024-01-24T14:30:00', type: 'product' },
  { id: '10', adminName: 'Super Admin', action: 'Dismissed Fraud Alert', target: 'False Positive', timestamp: '2024-01-24T12:00:00', type: 'alert' },
];

type LogType = 'user' | 'product' | 'alert' | 'system';

interface Log {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  type: LogType;
}

export function AdminLogsPage() {
  const [logs] = useState<Log[]>(mockLogs as Log[]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    if (action.includes('Banned')) return <Ban size={14} className="text-red-500" />;
    if (action.includes('Unbanned')) return <CheckCircle size={14} className="text-green-500" />;
    if (action.includes('Approved')) return <CheckCircle size={14} className="text-green-500" />;
    if (action.includes('Rejected')) return <Ban size={14} className="text-red-500" />;
    if (action.includes('User')) return <User size={14} className="text-blue-500" />;
    if (action.includes('Product')) return <Package size={14} className="text-yellow-500" />;
    return <Shield size={14} className="text-gray-500" />;
  };

  const getTypeStyle = (type: LogType) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-700';
      case 'product':
        return 'bg-yellow-100 text-yellow-700';
      case 'alert':
        return 'bg-red-100 text-red-700';
      case 'system':
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Recent admin actions and system events</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Administrator</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Target</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold">
                      {log.adminName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{log.adminName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    <span className="text-sm text-gray-700">{log.action}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{log.target}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getTypeStyle(log.type)}`}>
                    {log.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredLogs.map(log => (
          <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold">
                  {log.adminName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-900">{log.adminName}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getTypeStyle(log.type)}`}>
                {log.type}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getActionIcon(log.action)}
              <span className="text-sm text-gray-700">{log.action}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Target: {log.target}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No logs matching your search</p>
        </div>
      )}
    </div>
  );
}
