import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '../types';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { addItem } from '../../cart/cartSlice';
import type { RootState } from '../../../app/store';
import toast from 'react-hot-toast';
import { useProductLocale } from '../hooks/useProductLocale';

interface ProductCardProps {
  product: Product;
  index?: number;
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={s <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const isInCart = cartItems.some((item) => item.productId === product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 50;
  const { localise } = useProductLocale();
  const displayName = localise(product.id, 'name', product.name);
  const displayDesc = localise(product.id, 'description', product.description);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) { toast.error(`${product.name} is already in your cart`); return; }
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      quantity: 1,
      unit: product.unit,
      maxStock: product.stock,
    }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="h-52 bg-slate-50 dark:bg-slate-800 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.organic && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white px-2 py-0.5 rounded-sm">
              🌿 Organic
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded-sm">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-700 text-white px-2 py-0.5 rounded-sm">
              Sold Out
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/products/${product.id}`} className="flex-1">
          {/* Category */}
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 capitalize">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1">
            {displayName}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {displayDesc}
          </p>

          {/* Seller */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
            👨‍🌾 {product.farmerName} · {product.location}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRow rating={product.rating} size={13} />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <p className="text-lg font-extrabold text-green-700 dark:text-green-400 leading-none">
                ₹{product.retailPrice}
                <span className="text-xs font-normal text-slate-400 ml-1">/{product.unit}</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-wider">
                Bulk: ₹{product.wholesalePrice}/{product.unit}
              </p>
            </div>
            {!isOutOfStock && product.stock < 200 && (
              <p className="text-[10px] text-slate-400 text-right leading-tight">
                {product.stock} {product.unit}<br />
                <span className="text-slate-300 dark:text-slate-600">left</span>
              </p>
            )}
          </div>
        </Link>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-none ${isOutOfStock
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            : isInCart
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-green-600 text-white'
            }`}
        >
          {isOutOfStock ? 'Out of Stock' : isInCart ? (
            <><Check size={14} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={14} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}
