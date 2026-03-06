import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content_body?: string;
    quote?: string;
    image: string;
    date: string;
    author: string;
    comments: number;
}

interface BlogState {
    blogs: BlogPost[];
    featuredBlogs: BlogPost[];
    blogDetails: BlogPost | null;
    loading: boolean;
    error: string | null;
}

const initialState: BlogState = {
    blogs: [],
    featuredBlogs: [],
    blogDetails: null,
    loading: false,
    error: null,
};

// Mock data as initial state for now, similar to what was in the components
const mockBlogs: BlogPost[] = [
    {
        id: "1",
        title: "Bringing Food Production Back to Cities",
        excerpt: "Agricultural output is influenced by many factors. One of them is soil quality. Healthy soil is the foundation of a productive farming system.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
        date: "05 July 2022",
        author: "Kevin Martin",
        comments: 1,
    },
    {
        id: "2",
        title: "The Future of Farming, Smart Irrigation Solutions",
        excerpt: "Modern urban farming isn’t just a fad; it’s a necessity. As cities grow, the distance between the farm and the table increases.",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        date: "05 July 2022",
        author: "Kevin Martin",
        comments: 0,
    },
    {
        id: "3",
        title: "Relationship of Chemistry and Other Sciences",
        excerpt: "Vertical farming allows us to grow more food in less space. By stacking layers of crops, we can increase yield per square foot.",
        image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c3023?w=800&q=80",
        date: "05 July 2022",
        author: "Kevin Martin",
        comments: 0,
    },
];

export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async () => {
    // Simulate API call
    return new Promise<BlogPost[]>((resolve) => {
        setTimeout(() => resolve(mockBlogs), 1000);
    });
});

export const fetchBlogById = createAsyncThunk('blog/fetchBlogById', async (id: string) => {
    // Simulate API call
    return new Promise<BlogPost>((resolve, reject) => {
        const post = mockBlogs.find(b => b.id === id);
        setTimeout(() => {
            if (post) resolve(post);
            else reject("Blog not found");
        }, 500);
    });
});

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        addBlog: (state, action: PayloadAction<BlogPost>) => {
            state.blogs.push(action.payload);
        },
        deleteBlog: (state, action: PayloadAction<string>) => {
            state.blogs = state.blogs.filter(b => b.id !== action.payload);
        },
        updateBlog: (state, action: PayloadAction<BlogPost>) => {
            const index = state.blogs.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.blogs[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
                state.featuredBlogs = action.payload.slice(0, 3);
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch blogs';
            })
            .addCase(fetchBlogById.pending, (state) => {
                state.loading = true;
                state.blogDetails = null;
                state.error = null;
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.blogDetails = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch blog';
            });
    },
});

export const { addBlog, deleteBlog, updateBlog } = blogSlice.actions;
export default blogSlice.reducer;
