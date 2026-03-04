import { useState } from 'react';
import { AlertTriangle, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock fraud alerts
const mockAlerts = [
  {
    id: '1',
    type: 'suspicious_pricing',
    severity: 'high',
    message: 'Tomatoes priced at ₹500/kg (Market avg: ₹40/kg)',
    targetName: 'Expensive Tomatoes',
    farmerName: 'Vikram Singh',
    timestamp: '2024-01-25T10:30:00',
    status: 'pending',
  },
  {
    id: '2',
    type: 'abnormal_transaction',
    severity: 'medium',
    message: 'User made 15 transactions in 2 minutes',
    targetName: 'Priya Singh',
    farmerName: '-',
    timestamp: '2024-01-25T09:45:00',
    status: 'pending',
  },
  {
    id: '3',
    type: 'suspicious_pricing',
    severity: 'high',
    message: 'Wheat priced at ₹800/kg (Market avg: ₹35/kg)',
    targetName: 'Overpriced Wheat',
    farmerName: 'Rajesh Gupta',
    timestamp: '2024-01-25T08:20:00',
    status: 'resolved',
  },
  {
    id: '4',
    type: 'abnormal_activity',
    severity: 'low',
    message: 'Multiple failed login attempts detected',
    targetName: 'anil@example.com',
    farmerName: '-',
    timestamp: '2024-01-24T22:15:00',
    status: 'dismissed',
  },
  {
    id: '5',
    type: 'suspicious_pricing',
    severity: 'medium',
    message: 'Onions priced at ₹200/kg (Market avg: ₹30/kg)',
    targetName: 'Premium Onions',
    farmerName: 'Suresh Patel',
    timestamp: '2024-01-24T16:30:00',
    status: 'pending',
  },
];

type Status = 'pending' | 'resolved' | 'dismissed';
type Severity = 'low' | 'medium' | 'high';

interface Alert {
  id: string;
  type: string;
  severity: Severity;
  message: string;
  targetName: string;
  farmerName: string;
  timestamp: string;
  status: Status;
}

export function FraudDetectionPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts as Alert[]);

  const handleResolve = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, status: 'resolved' as Status } : alert
      )
    );
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, status: 'dismissed' as Status } : alert
      )
    );
  };

  const getSeverityStyle = (severity: Severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'dismissed':
        return 'bg-gray-100 text-gray-500';
    }
  };

  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const highSeverityCount = alerts.filter(a => a.severity === 'high' && a.status === 'pending').length;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="text-yellow-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Fraud Alerts</h1>
        </div>
        <p className="text-sm text-gray-500">Monitor suspicious activity and pricing anomalies</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <p className="text-xs text-red-600 uppercase font-medium mb-1">High Severity</p>
          <p className="text-2xl font-bold text-red-600">{highSeverityCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase font-medium mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg border p-4 ${
              alert.status === 'pending' && alert.severity === 'high'
                ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
                : alert.status === 'pending'
                ? 'border-l-4 border-l-yellow-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
                : 'border-gray-200 opacity-75'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getSeverityStyle(alert.severity)}`}>
                  {alert.type === 'suspicious_pricing' ? (
                    <TrendingDown size={20} />
                  ) : (
                    <AlertTriangle size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${getSeverityStyle(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    {alert.status !== 'pending' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusStyle(alert.status)}`}>
                        {alert.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      Target: <strong className="text-gray-700">{alert.targetName}</strong>
                    </span>
                    {alert.farmerName !== '-' && (
                      <span className="flex items-center gap-1">
                        Farmer: <strong className="text-gray-700">{alert.farmerName}</strong>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              {alert.status === 'pending' && (
                <div className="flex items-center gap-2 ml-auto md:ml-0">
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded font-medium bg-green-600 text-white"
                  >
                    <CheckCircle size={14} />
                    Resolve
                  </button>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded font-medium bg-gray-100 text-gray-700"
                  >
                    <XCircle size={14} />
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertTriangle className="mx-auto text-gray-400 mb-2" size={48} />
          <p className="text-gray-500">No fraud alerts at this time</p>
        </div>
      )}
    </div>
  );
}
