import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

// Mock data
const mockUsers = [
  { id: '1', name: 'Ramesh Kumar', email: 'ramesh@example.com', role: 'farmer', status: 'active', createdAt: '2024-01-10', lastLogin: '2024-01-25' },
  { id: '2', name: 'Suresh Patel', email: 'suresh@example.com', role: 'farmer', status: 'active', createdAt: '2024-01-12', lastLogin: '2024-01-24' },
  { id: '3', name: 'Vikram Wholesale', email: 'vikram@wholesale.com', role: 'wholesaler', status: 'banned', createdAt: '2024-01-05', lastLogin: '2024-01-25' },
  { id: '4', name: 'Priya Singh', email: 'priya@example.com', role: 'user', status: 'active', createdAt: '2024-01-15', lastLogin: '2024-01-23' },
  { id: '5', name: 'Anil Sharma', email: 'anil@example.com', role: 'farmer', status: 'pending', createdAt: '2024-01-18', lastLogin: '2024-01-22' },
  { id: '6', name: 'Meena Devi', email: 'meena@example.com', role: 'user', status: 'active', createdAt: '2024-01-20', lastLogin: '2024-01-25' },
  { id: '7', name: 'Rajesh Gupta', email: 'rajesh@wholesale.com', role: 'wholesaler', status: 'active', createdAt: '2024-01-08', lastLogin: '2024-01-24' },
  { id: '8', name: 'Super Admin', email: 'admin@krushikranti.com', role: 'admin', status: 'active', createdAt: '2024-01-01', lastLogin: '2024-01-25' },
];

type Role = 'farmer' | 'wholesaler' | 'user' | 'admin';
type Status = 'active' | 'banned' | 'pending';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
  lastLogin: string;
}

export function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers as User[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  const handleToggleBan = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' }
          : user
      )
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'banned':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getRoleStyle = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-green-600 text-white';
      case 'farmer':
        return 'bg-green-100 text-green-700';
      case 'wholesaler':
        return 'bg-yellow-100 text-yellow-700';
      case 'user':
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage platform users, roles, and access</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as Role | 'all')}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="farmer">Farmers</option>
            <option value="wholesaler">Wholesalers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">Last Login</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-green-800 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleStyle(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusStyle(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleBan(user.id)}
                      className={`text-xs px-3 py-1 rounded font-medium ${
                        user.status === 'banned'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status === 'banned' ? 'Unban' : 'Ban'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusStyle(user.status)}`}>
                {user.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleStyle(user.role)}`}>
                {user.role}
              </span>
              <span className="text-xs text-gray-500">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            {user.role !== 'admin' && (
              <button
                onClick={() => handleToggleBan(user.id)}
                className={`w-full text-xs py-2 rounded font-medium ${
                  user.status === 'banned'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {user.status === 'banned' ? 'Unban User' : 'Ban User'}
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
