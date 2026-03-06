import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Heart, Loader2, Minus, Plus, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchProductById, clearSelectedProduct } from '../productSlice';
import { addItem } from '../../cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../wishlist/wishlistSlice';
import type { RootState } from '../../../app/store';
import toast from 'react-hot-toast';
import { useProductLocale } from '../hooks/useProductLocale';

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#60af5a' : 'none'}
          stroke={s <= Math.round(rating) ? '#60af5a' : '#d1d5db'} strokeWidth="1.5">
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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => { dispatch(clearSelectedProduct()); };
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      quantity: quantity,
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

  // Multiple images logic
  const displayImages = product
    ? product.images.length > 1
      ? product.images
      : [product.images[0], product.images[0], product.images[0]]
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

  const socialLinks = [
    { icon: Facebook, color: "text-blue-600" },
    { icon: Twitter, color: "text-blue-400" },
    { icon: Linkedin, color: "text-blue-700" },
    { icon: Instagram, color: "text-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
          {/* Main Image Section */}
          <div className="space-y-6">
            <div className="aspect-square bg-[#F7F7F7] dark:bg-gray-900 rounded-[2rem] p-12 flex items-center justify-center">
              <img
                src={displayImages[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
            {/* Multi-image thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-4 justify-center">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden bg-[#F7F7F7] border-2 transition-all ${activeImage === idx ? 'border-green-600' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details info */}
          <div className="space-y-8 py-4">
            <div className="flex items-baseline justify-between">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
              <p className="text-2xl font-bold text-green-600">₹{product.retailPrice.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <StarRow rating={product.rating} size={14} />
              <span>({product.reviewCount} Customer Review)</span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {displayDesc}
            </p>

            <div className="flex items-center gap-6 pt-4">
              <span className="text-sm font-bold text-slate-800 dark:text-white">Choose Quantity</span>
              <div className="flex items-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 py-2 text-center text-sm font-bold bg-transparent outline-none"
                />
                <div className="flex flex-col border-l border-slate-200 dark:border-slate-800">
                  <button onClick={() => setQuantity(q => q + 1)} className="px-1.5 py-0.5 hover:bg-slate-50 border-b border-slate-200 dark:border-slate-800"><Plus size={10} /></button>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-1.5 py-0.5 hover:bg-slate-50"><Minus size={10} /></button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#4CAF50] hover:bg-green-600 text-white font-bold py-4 rounded-lg text-xs tracking-widest uppercase transition-all"
              >
                {isInCart ? "Added to Cart" : "Add to cart"}
              </button>
              <button
                onClick={handleWishlist}
                className="flex-1 bg-[#F9C04D] hover:bg-yellow-500 text-white font-bold py-4 rounded-lg text-xs tracking-widest uppercase transition-all shadow-sm shadow-yellow-500/20"
              >
                {isInWishlist ? "In Wishlist" : "Add to wishlist"}
              </button>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <span className="text-xs font-bold text-slate-800 dark:text-white">Share with Friends</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                  <button key={idx} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-gray-800 flex items-center justify-center text-slate-600 hover:text-green-600 transition-colors">
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-16 mb-24">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-10">Description</h2>
          <div className="space-y-8 text-slate-500 dark:text-slate-400 text-sm leading-[1.8]">
            <p>{displayDesc}</p>
            <p>Aliquam et facilisis arcuut olestie augue. Suspendisse sodales tortor nunc quis auctor ligula posuere cursus duis aute irure dolor in reprehenderit in voluptate velit esse cill doloreeu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Vivamus sed delly molestie sapien. Aliquam et facilisis arcuut molestie augue.</p>
          </div>
        </div>

        {/* Review List */}
        <div className="mb-24">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10">{product.reviewCount} review for {displayName}</h2>
          <div className="space-y-12">
            {(product.reviews || []).map((rev, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                  <img src={`https://i.pravatar.cc/150?u=${rev.userId}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{rev.userName}</h4>
                    <span className="text-xs text-green-600 font-bold">{new Date(rev.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
                    {rev.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Form */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-16">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10">Add a review</h2>
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
              <input type="checkbox" id="saveInfo" className="w-4 h-4 rounded border-slate-200" />
              <label htmlFor="saveInfo">Save my name, email, and website in this browser for the next time I comment.</label>
            </div>

            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-4">Your rating</p>
              <StarRow rating={5} size={14} />
            </div>

            <div className="space-y-4">
              <textarea
                placeholder="Your Review..."
                className="w-full bg-[#F7F7F7] dark:bg-gray-900 border-none rounded-xl p-6 text-sm outline-none resize-none h-40"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="w-full bg-[#F7F7F7] dark:bg-gray-900 border-none rounded-xl p-6 text-sm outline-none" />
                <input type="email" placeholder="Email Address" className="w-full bg-[#F7F7F7] dark:bg-gray-900 border-none rounded-xl p-6 text-sm outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
