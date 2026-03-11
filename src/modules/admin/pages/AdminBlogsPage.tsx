import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Eye, Loader2, Archive, Send, Edit2, SendHorizonal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../app/store";
import {
  fetchAdminBlogs,
  fetchBlogStats,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  archiveBlog,
} from "../../blog/blogSlice";
import toast from "react-hot-toast";

export function AdminBlogsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { adminBlogs, adminPagination, stats, adminLoading } = useSelector(
    (state: RootState) => state.blog
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [acting, setActing] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAdminBlogs({ page, size: 10, search: search || undefined }));
    dispatch(fetchBlogStats());
  }, [dispatch, page, search]);

  const refresh = async () => {
    await dispatch(fetchAdminBlogs({ page, size: 10, search: search || undefined }));
    await dispatch(fetchBlogStats());
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog permanently?")) return;
    setActing(id);
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success("Blog deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setActing(null);
    }
  };

  const handlePublish = async (id: number) => {
    setActing(id);
    try {
      await dispatch(publishBlog(id)).unwrap();
      toast.success("Blog published");
      await refresh();
    } catch {
      toast.error("Failed to publish blog");
    } finally {
      setActing(null);
    }
  };

  const handleUnpublish = async (id: number) => {
    setActing(id);
    try {
      await dispatch(unpublishBlog(id)).unwrap();
      toast.success("Blog unpublished");
      await refresh();
    } catch {
      toast.error("Failed to unpublish blog");
    } finally {
      setActing(null);
    }
  };

  const handleArchive = async (id: number) => {
    setActing(id);
    try {
      await dispatch(archiveBlog(id)).unwrap();
      toast.success("Blog archived");
      await refresh();
    } catch {
      toast.error("Failed to archive blog");
    } finally {
      setActing(null);
    }
  };

  const statusBadge: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    ARCHIVED: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all blog posts on the platform</p>
        </div>
        <button
          onClick={() => navigate("/admin/blogs/create")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Blogs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-green-800 p-4">
          <p className="text-xs text-green-600 uppercase font-medium mb-1">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
          <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {adminLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-green-600" size={36} />
        </div>
      ) : adminBlogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <Plus className="mx-auto text-gray-400 mb-2" size={48} />
          <p className="text-gray-500 mb-4">No blog posts found</p>
          <button
            onClick={() => navigate("/admin/blogs/create")}
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
          >
            Create your first blog
          </button>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-900/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 dark:text-green-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 dark:text-green-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 dark:text-green-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 dark:text-green-400 uppercase">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 dark:text-green-400 uppercase">Created Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-green-800 dark:text-green-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {adminBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {blog.imageUrl && <img src={blog.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />}
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{blog.category ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[blog.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{blog.authorName ?? "Unknown"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)} className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                          <Edit2 size={11} /> Edit
                        </button>
                        {blog.status === "DRAFT" && (
                          <button onClick={() => handlePublish(blog.id)} disabled={acting === blog.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium bg-green-600 text-white disabled:opacity-50">
                            <Send size={11} /> Publish
                          </button>
                        )}
                        {blog.status === "PUBLISHED" && (
                          <button onClick={() => handleUnpublish(blog.id)} disabled={acting === blog.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 disabled:opacity-50">
                            <SendHorizonal size={11} /> Unpublish
                          </button>
                        )}
                        {blog.status !== "ARCHIVED" && (
                          <button onClick={() => handleArchive(blog.id)} disabled={acting === blog.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50">
                            <Archive size={11} /> Archive
                          </button>
                        )}
                        <a href={`/blog/${blog.slug || blog.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                          <Eye size={11} /> View
                        </a>
                        <button onClick={() => handleDelete(blog.id)} disabled={acting === blog.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium bg-red-50 dark:bg-red-900/20 text-red-600 disabled:opacity-50">
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adminPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50">
                Prev
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">Page {page + 1} of {adminPagination.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(adminPagination.totalPages - 1, p + 1))} disabled={page >= adminPagination.totalPages - 1} className="px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
