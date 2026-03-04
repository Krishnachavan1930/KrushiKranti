import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { addProduct } from '../farmerSlice';
import { ProductForm } from '../components/ProductForm';
import type { ProductFormData } from '../types';

export function AddProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSubmitting } = useAppSelector((state) => state.farmer);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await dispatch(addProduct(data)).unwrap();
      toast.success('Product added successfully!');
      navigate('/farmer/products');
    } catch {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/farmer/products"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the details to list your product
          </p>
        </motion.div>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Add Product"
        />
      </div>
    </div>
  );
}
