import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchInventory } from '../wholesalerSlice';

export function InventoryPage() {
  const dispatch = useAppDispatch();
  const { inventory, isLoading } = useAppSelector((state) => state.wholesaler);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    const styles = {
      'in-stock': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'low-stock': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'out-of-stock': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status as keyof typeof styles] || styles['in-stock'];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading && inventory.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  const totalValue = inventory.reduce((sum, item) => sum + item.purchasePrice, 0);
  const lowStockItems = inventory.filter((item) => item.status === 'low-stock').length;
  const outOfStockItems = inventory.filter((item) => item.status === 'out-of-stock').length;

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your purchased stock and inventory levels
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {inventory.length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ₹{totalValue.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Alerts</p>
            <div className="flex items-center gap-2">
              {(lowStockItems > 0 || outOfStockItems > 0) && (
                <AlertTriangle className="text-orange-500" size={20} />
              )}
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lowStockItems + outOfStockItems}
              </p>
              <span className="text-sm text-gray-500">items need attention</span>
            </div>
          </motion.div>
        </div>

        {/* Inventory List */}
        {inventory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No inventory yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your approved purchases will appear here
            </p>
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Supplier
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Purchase Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Purchase Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {inventory.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {item.farmerName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            item.status === 'out-of-stock'
                              ? 'text-red-600 dark:text-red-400'
                              : item.status === 'low-stock'
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        ₹{item.purchasePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(item.status)}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {inventory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.farmerName}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(item.status)}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span>
                          <span className="text-gray-500">Qty: </span>
                          <span
                            className={`font-medium ${
                              item.status !== 'in-stock' ? 'text-orange-600' : ''
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </span>
                        </span>
                        <span>
                          <span className="text-gray-500">Value: </span>
                          <span className="font-medium text-primary-600">
                            ₹{item.purchasePrice.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
