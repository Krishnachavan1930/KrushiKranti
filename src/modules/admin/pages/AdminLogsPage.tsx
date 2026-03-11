import { useState, useEffect, useCallback } from 'react';
import { Search, Clock, User, Package, Shield, Ban, CheckCircle, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../adminService';

type LogType = 'user' | 'product' | 'alert' | 'system';

interface Log {
  id: number;
  adminId: number;
  adminName: string;
  action: string;
  target: string;
  type: LogType;
  createdAt: string;
}

export function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getAdminLogs(page, pageSize, debouncedSearch || undefined);
      setLogs(result.logs as Log[]);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

      {/* Demo Data Notice */}
      <div className="flex items-center gap-2 p-3 mb-6 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <Info size={16} className="shrink-0" />
        <span>Showing demo data. Audit log API is under development.</span>
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
