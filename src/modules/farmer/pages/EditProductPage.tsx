import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { updateProduct, fetchFarmerProducts } from '../farmerSlice';
import { ProductForm } from '../components/ProductForm';
import type { ProductFormData } from '../types';

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, isSubmitting, isLoading } = useAppSelector((state) => state.farmer);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchFarmerProducts());
    }
  }, [dispatch, products.length]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return;
    try {
      await dispatch(updateProduct({ id, data })).unwrap();
      toast.success('Product updated successfully!');
      navigate('/farmer/products');
    } catch {
      toast.error('Failed to update product');
    }
  };

  if (isLoading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="py-8">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <Link to="/farmer/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const initialData: Partial<ProductFormData> = product
    ? {
        name: product.name,
        category: product.category,
        description: product.description,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        quantity: product.quantity,
        unit: product.unit,
        organic: product.organic,
        imagePreview: product.images[0],
      }
    : {};

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
            Edit Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update your product details
          </p>
        </motion.div>

        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Update Product"
        />
      </div>
    </div>
  );
}
