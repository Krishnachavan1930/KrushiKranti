import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../shared/hooks';
import { fetchProducts, fetchCategories, setFilters, clearFilters, setPage } from '../productSlice';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { useTranslation } from 'react-i18next';
import type { ProductCategory } from '../types';

export function ProductListPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, categories, filters, pagination, isLoading, error } = useAppSelector(
    (state) => state.product
  );
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const categoryLabels: Record<ProductCategory, string> = {
    vegetables: t('categories.vegetables'),
    fruits: t('categories.fruits'),
    grains: t('categories.grains'),
    pulses: t('categories.pulses'),
    spices: t('categories.spices'),
    dairy: t('categories.dairy'),
    other: t('categories.other'),
  };

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ filters, page: pagination.page, limit: pagination.limit }));
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category: category === '' ? undefined : (category as ProductCategory) }));
    dispatch(setPage(1));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchInput('');
    dispatch(setPage(1));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = !!(filters.category || filters.search || filters.organic);

  // --- Clean minimal filter sidebar ---
  const FilterPanel = () => (
    <div>
      {/* Category section */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Category</p>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => handleCategoryChange('')}
              className={`w-full text-left px-2 py-1.5 text-sm rounded transition-none ${!filters.category
                  ? 'text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded capitalize transition-none ${filters.category === cat
                    ? 'text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20'
                    : 'text-slate-600 dark:text-slate-400'
                  }`}
              >
                {categoryLabels[cat]}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Organic section */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Type</p>
        <label className="flex items-center gap-3 cursor-pointer px-2 py-1.5">
          <div
            role="checkbox"
            aria-checked={!!filters.organic}
            onClick={() => dispatch(setFilters({ organic: filters.organic ? undefined : true }))}
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer ${filters.organic
                ? 'bg-green-600 border-green-600'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900'
              }`}
          >
            {filters.organic && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Organic only</span>
        </label>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="text-xs text-slate-400 dark:text-slate-500 px-2 py-1 underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('products.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {pagination.total > 0
              ? `${pagination.total} products available`
              : t('products.subtitle')}
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={t('products.search_placeholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
            </div>

            {/* Mobile: filter toggle */}
            <button
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-900"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="16" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" />
              </svg>
              Filters
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Filters</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-44 shrink-0 pt-1">
          <FilterPanel />
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-5 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <p className="text-xs text-slate-400 mb-5">
              Showing <strong className="text-slate-600 dark:text-slate-300">{products.length}</strong> of {pagination.total} products
              {filters.category && (
                <> · filtered by <strong className="text-green-600">{categoryLabels[filters.category as ProductCategory]}</strong></>
              )}
            </p>
          )}

          {/* Grid: 3 col desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </div>

          {/* Empty state */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
                {t('products.no_products')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t('products.no_products_desc')}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-400 disabled:opacity-40"
              >
                ←
              </button>
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 text-sm font-semibold rounded-lg ${pagination.page === i + 1
                      ? 'bg-green-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-400 disabled:opacity-40"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
