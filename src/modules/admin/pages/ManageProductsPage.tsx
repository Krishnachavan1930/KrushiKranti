import { useState } from "react";
import { Search, Filter, AlertTriangle } from "lucide-react";

// Mock data
const mockProducts = [
  {
    id: "1",
    name: "Organic Tomatoes",
    category: "vegetables",
    farmerName: "Ramesh Kumar",
    price: 60,
    wholesalePrice: 45,
    stock: 500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1546473427-e1ad00490b6a?w=100",
    status: "pending",
    isSuspicious: false,
  },
  {
    id: "2",
    name: "Fresh Spinach",
    category: "vegetables",
    farmerName: "Suresh Patel",
    price: 40,
    wholesalePrice: 30,
    stock: 200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100",
    status: "approved",
    isSuspicious: false,
  },
  {
    id: "3",
    name: "Premium Rice",
    category: "grains",
    farmerName: "Anil Sharma",
    price: 120,
    wholesalePrice: 95,
    stock: 1000,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100",
    status: "approved",
    isSuspicious: false,
  },
  {
    id: "4",
    name: "Organic Mangoes",
    category: "fruits",
    farmerName: "Meena Devi",
    price: 150,
    wholesalePrice: 120,
    stock: 300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=100",
    status: "pending",
    isSuspicious: false,
  },
  {
    id: "5",
    name: "Expensive Onions",
    category: "vegetables",
    farmerName: "Rajesh Gupta",
    price: 500,
    wholesalePrice: 450,
    stock: 100,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100",
    status: "pending",
    isSuspicious: true,
  },
  {
    id: "6",
    name: "Fresh Potatoes",
    category: "vegetables",
    farmerName: "Prakash Deshmukh",
    price: 35,
    wholesalePrice: 25,
    stock: 800,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber8e7?w=100",
    status: "approved",
    isSuspicious: false,
  },
  {
    id: "7",
    name: "Overpriced Wheat",
    category: "grains",
    farmerName: "Vikram Singh",
    price: 800,
    wholesalePrice: 750,
    stock: 500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100",
    status: "rejected",
    isSuspicious: true,
  },
];

type Status = "pending" | "approved" | "rejected";

interface Product {
  id: string;
  name: string;
  category: string;
  farmerName: string;
  price: number;
  wholesalePrice: number;
  stock: number;
  unit: string;
  image: string;
  status: Status;
  isSuspicious: boolean;
}

export function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>(
    mockProducts as Product[],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const handleApprove = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, status: "approved" as Status }
          : product,
      ),
    );
  };

  const handleReject = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, status: "rejected" as Status }
          : product,
      ),
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage product listings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by product or farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">
                Farmer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-green-800 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={product.isSuspicious ? "bg-yellow-50" : ""}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/40";
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {product.category}
                        </p>
                      </div>
                      {product.isSuspicious && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full font-medium">
                          <AlertTriangle size={12} />
                          Alert
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.farmerName}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{product.price}/{product.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Wholesale: ₹{product.wholesalePrice}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.stock} {product.unit}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusStyle(product.status)}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {product.status === "pending" && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="text-xs px-3 py-1 rounded font-medium bg-green-600 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="text-xs px-3 py-1 rounded font-medium bg-red-100 text-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg border p-4 ${product.isSuspicious ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/48";
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  {product.isSuspicious && (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full font-medium">
                      <AlertTriangle size={10} />
                      Alert
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">by {product.farmerName}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusStyle(product.status)}`}
              >
                {product.status}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ₹{product.price}/{product.unit}
                </p>
                <p className="text-xs text-gray-500">
                  Wholesale: ₹{product.wholesalePrice}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {product.stock} {product.unit} in stock
              </p>
            </div>
            {product.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(product.id)}
                  className="flex-1 text-xs py-2 rounded font-medium bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(product.id)}
                  className="flex-1 text-xs py-2 rounded font-medium bg-red-100 text-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
