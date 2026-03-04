import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Heart, MapPin, User, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchProductById, clearSelectedProduct } from '../productSlice';
import { addItem } from '../../cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../wishlist/wishlistSlice';
import { ReviewSection } from '../components/ReviewSection';
import type { Product } from '../types';
import type { RootState } from '../../../app/store';
import toast from 'react-hot-toast';
import { useProductLocale } from '../hooks/useProductLocale';

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={s <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, isLoadingProduct: isLoading, error } = useAppSelector(
    (state: RootState) => state.product
  );
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const wishlistItems = useAppSelector((state: RootState) => state.wishlist?.items || []);
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  const isInCart = product ? cartItems.some((item) => item.productId === product.id) : false;
  const isInWishlist = product ? wishlistItems.some((item: { id: string }) => item.id === product.id) : false;

  const { localise } = useProductLocale();
  const displayName = product ? localise(product.id, 'name', product.name) : '';
  const displayDesc = product ? localise(product.id, 'description', product.description) : '';

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => { dispatch(clearSelectedProduct()); };
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
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

  const handleWishlist = () => {
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    if (!product) return;
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.retailPrice,
        unit: product.unit,
      }));
      toast.success('Added to wishlist!');
    }
  };

  // Multiple images: if only one, create variety by using the same + placeholders
  const displayImages = product
    ? product.images.length > 1
      ? product.images
      : [
        product.images[0],
        product.images[0],
        product.images[0],
      ]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-gray-950">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-gray-950 gap-4">
        <p className="text-5xl">🌿</p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product not found</h2>
        <button onClick={() => navigate('/products')} className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-600">Products</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{displayName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* LEFT: Image Gallery */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800">
              <img
                src={displayImages[activeImage]}
                alt={product.name}
                className="w-full h-80 lg:h-[420px] object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="flex gap-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImage === idx
                      ? 'border-green-600'
                      : 'border-slate-200 dark:border-slate-700'
                      }`}
                  >
                    <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5">
            {/* Category + Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded capitalize">
                  {product.category}
                </span>
                {product.organic && (
                  <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
                    🌿 Organic
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {displayName}
              </h1>
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-3">
              <StarRow rating={product.rating} size={18} />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
              <span className="text-sm text-slate-500">({product.reviewCount} reviews)</span>
              <span className="text-slate-300">·</span>
              <span className={`text-sm font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock} ${product.unit}s available`}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {displayDesc}
            </p>

            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                {product.farmerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <User size={14} className="text-slate-400" /> {product.farmerName}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin size={12} /> {product.location}
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 p-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Retail Price</p>
                  <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                    ₹{product.retailPrice}
                    <span className="text-sm font-normal text-slate-500 ml-1">/{product.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Wholesale Price</p>
                  <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">
                    ₹{product.wholesalePrice}
                    <span className="text-sm font-normal text-slate-500 ml-1">/{product.unit}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">* Wholesale pricing available for bulk orders of 100+ units</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-none ${isOutOfStock
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : isInCart
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-300 dark:border-green-700'
                    : 'bg-green-600 text-white'
                  }`}
              >
                {isInCart ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>

              <button
                onClick={handleWishlist}
                className={`px-4 py-3 rounded-lg border transition-none ${isInWishlist
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-500'
                  : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
              >
                <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">
                📦 Unit: {product.unit}
              </span>
              <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">
                🏷 ID: {product.id}
              </span>
              {product.organic && (
                <span className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full">
                  ✓ Certified Organic
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection reviews={product.reviews || []} productId={product.id} />
      </div>
    </div>
  );
}
