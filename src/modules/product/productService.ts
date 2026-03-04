import type { Product, ProductCategory, ProductFilters, PaginatedResponse } from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Farm-fresh tomatoes grown organically without pesticides. Perfect for salads, cooking, and making sauces.',
    category: 'vegetables',
    retailPrice: 40,
    wholesalePrice: 28,
    unit: 'kg',
    stock: 500,
    images: ['https://images.unsplash.com/photo-1546470427-227c7369b839?w=400'],
    farmerId: '1',
    farmerName: 'Ramesh Kumar',
    location: 'Nashik, Maharashtra',
    organic: true,
    rating: 4.5,
    reviewCount: 128,
    createdAt: new Date().toISOString(),
    reviews: [
      {
        id: 'rev1',
        userId: 'u1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Very fresh and juicy tomatoes. Loved them!',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rev2',
        userId: 'u2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Good quality, but slightly expensive.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    name: 'Basmati Rice',
    description: 'Premium quality aged Basmati rice with long grains and aromatic flavor.',
    category: 'grains',
    retailPrice: 120,
    wholesalePrice: 95,
    unit: 'kg',
    stock: 1000,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    farmerId: '2',
    farmerName: 'Suresh Patel',
    location: 'Karnal, Haryana',
    organic: false,
    rating: 4.8,
    reviewCount: 256,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alphonso Mangoes',
    description: 'Sweet and juicy Alphonso mangoes from Ratnagiri. Known as the king of mangoes.',
    category: 'fruits',
    retailPrice: 800,
    wholesalePrice: 600,
    unit: 'dozen',
    stock: 200,
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'],
    farmerId: '3',
    farmerName: 'Prakash Deshmukh',
    location: 'Ratnagiri, Maharashtra',
    organic: true,
    rating: 4.9,
    reviewCount: 512,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Green Chillies',
    description: 'Fresh green chillies with the perfect balance of heat and flavor.',
    category: 'vegetables',
    retailPrice: 60,
    wholesalePrice: 45,
    unit: 'kg',
    stock: 300,
    images: ['https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400'],
    farmerId: '1',
    farmerName: 'Ramesh Kumar',
    location: 'Guntur, Andhra Pradesh',
    organic: false,
    rating: 4.3,
    reviewCount: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Toor Dal',
    description: 'High-quality split pigeon peas, perfect for making dal and sambhar.',
    category: 'pulses',
    retailPrice: 150,
    wholesalePrice: 120,
    unit: 'kg',
    stock: 800,
    images: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'],
    farmerId: '4',
    farmerName: 'Mahesh Yadav',
    location: 'Indore, Madhya Pradesh',
    organic: true,
    rating: 4.6,
    reviewCount: 167,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Fresh Milk',
    description: 'Pure cow milk from grass-fed cows. Fresh and delivered daily.',
    category: 'dairy',
    retailPrice: 60,
    wholesalePrice: 50,
    unit: 'liter',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'],
    farmerId: '5',
    farmerName: 'Govind Dairy',
    location: 'Anand, Gujarat',
    organic: true,
    rating: 4.7,
    reviewCount: 342,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Turmeric Powder',
    description: 'Pure turmeric powder with high curcumin content. Ground fresh from organic turmeric roots.',
    category: 'spices',
    retailPrice: 200,
    wholesalePrice: 150,
    unit: 'kg',
    stock: 400,
    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'],
    farmerId: '6',
    farmerName: 'Spice Valley Farm',
    location: 'Erode, Tamil Nadu',
    organic: true,
    rating: 4.8,
    reviewCount: 421,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Bananas',
    description: 'Fresh yellow bananas, rich in potassium and naturally sweet.',
    category: 'fruits',
    retailPrice: 50,
    wholesalePrice: 35,
    unit: 'dozen',
    stock: 600,
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'],
    farmerId: '7',
    farmerName: 'Banana Farms',
    location: 'Jalgaon, Maharashtra',
    organic: false,
    rating: 4.4,
    reviewCount: 198,
    createdAt: new Date().toISOString(),
  },
];

export const productService = {
  async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 8
  ): Promise<PaginatedResponse<Product>> {
    await delay(800);

    let filtered = [...mockProducts];

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.farmerName.toLowerCase().includes(search)
      );
    }

    if (filters.organic !== undefined) {
      filtered = filtered.filter((p) => p.organic === filters.organic);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.retailPrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.retailPrice <= filters.maxPrice!);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(600);
    return mockProducts.find((p) => p.id === id) || null;
  },

  async getCategories(): Promise<ProductCategory[]> {
    await delay(200);
    return ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other'];
  },
};
