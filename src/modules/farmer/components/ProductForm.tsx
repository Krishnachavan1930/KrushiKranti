import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Loader2 } from 'lucide-react';
import type { ProductFormData } from '../types';
import type { ProductCategory } from '../../product/types';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.enum(['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  retailPrice: z.number().min(1, 'Retail price must be greater than 0'),
  wholesalePrice: z.number().min(1, 'Wholesale price must be greater than 0'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  organic: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'spices', label: 'Spices' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'other', label: 'Other' },
];

const units = ['kg', 'g', 'piece', 'dozen', 'litre', 'ml', 'bundle'];

export function ProductForm({ initialData, onSubmit, isSubmitting, submitLabel }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imagePreview);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'vegetables',
      description: initialData?.description || '',
      retailPrice: initialData?.retailPrice || 0,
      wholesalePrice: initialData?.wholesalePrice || 0,
      quantity: initialData?.quantity || 0,
      unit: initialData?.unit || 'kg',
      organic: initialData?.organic || false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        category: initialData.category || 'vegetables',
        description: initialData.description || '',
        retailPrice: initialData.retailPrice || 0,
        wholesalePrice: initialData.wholesalePrice || 0,
        quantity: initialData.quantity || 0,
        unit: initialData.unit || 'kg',
        organic: initialData.organic || false,
      });
      setImagePreview(initialData.imagePreview);
    }
  }, [initialData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(undefined);
  };

  const onFormSubmit = async (data: ProductFormValues) => {
    await onSubmit({
      ...data,
      imagePreview,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onFormSubmit)}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            {...register('name')}
            className="input-field"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select {...register('category')} className="input-field">
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit *
          </label>
          <select {...register('unit')} className="input-field">
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="input-field resize-none"
            placeholder="Describe your product"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Retail Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Retail Price (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('retailPrice', { valueAsNumber: true })}
            className="input-field"
            placeholder="0.00"
          />
          {errors.retailPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.retailPrice.message}</p>
          )}
        </div>

        {/* Wholesale Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wholesale Price (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('wholesalePrice', { valueAsNumber: true })}
            className="input-field"
            placeholder="0.00"
          />
          {errors.wholesalePrice && (
            <p className="text-red-500 text-sm mt-1">{errors.wholesalePrice.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            className="input-field"
            placeholder="0"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Organic Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('organic')}
              className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              This is an organic product
            </span>
          </label>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Image
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-sm text-gray-500">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={20} />}
          {submitLabel}
        </button>
      </div>
    </motion.form>
  );
}
