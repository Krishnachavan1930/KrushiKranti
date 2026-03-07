import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchMyBulkProducts, createBulkProduct, deleteBulkProduct } from '../bulkSlice';
import { RiLoader4Line, RiAddLine, RiDeleteBinLine, RiCloseLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import type { BulkProductFormData } from '../types';
import ImageUpload from '../../../shared/components/ImageUpload';

export function FarmerBulkProductsPage() {
    const dispatch = useAppDispatch();
    const { myProducts, isLoading, isSubmitting } = useAppSelector((state) => state.bulk);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<BulkProductFormData>({
        name: '', description: '', quantity: 0, minimumPrice: 0, location: '', imageUrl: '',
    });

    useEffect(() => {
        dispatch(fetchMyBulkProducts());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.quantity || !form.minimumPrice) {
            toast.error('Please fill required fields');
            return;
        }
        try {
            await dispatch(createBulkProduct(form)).unwrap();
            toast.success('Bulk product created!');
            setShowForm(false);
            setForm({ name: '', description: '', quantity: 0, minimumPrice: 0, location: '', imageUrl: '' });
        } catch (err) {
            toast.error((err as string) || 'Failed to create product');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this bulk product?')) return;
        try {
            await dispatch(deleteBulkProduct(id)).unwrap();
            toast.success('Product deleted');
        } catch (err) {
            toast.error((err as string) || 'Failed to delete');
        }
    };

    return (
        <div style={{ padding: '24px 20px', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>My Bulk Products</h1>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Manage your bulk marketplace listings</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                        background: showForm ? '#ef4444' : '#16a34a', color: '#fff',
                        border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    {showForm ? <><RiCloseLine /> Cancel</> : <><RiAddLine /> Add Bulk Product</>}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
                    padding: 24, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                }}>
                    <div style={{ gridColumn: '1/3' }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Product Banner Image</label>
                        <ImageUpload
                            onUploadSuccess={(res) => setForm({ ...form, imageUrl: res.url })}
                            onImageRemove={() => setForm({ ...form, imageUrl: '' })}
                            initialImageUrl={form.imageUrl}
                        />
                    </div>
                    <div style={{ gridColumn: '1/3' }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Product Name *</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                            placeholder="e.g. Organic Basmati Rice" />
                    </div>
                    <div style={{ gridColumn: '1/3' }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, minHeight: 80 }}
                            placeholder="Describe your product..." />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Quantity *</label>
                        <input type="number" value={form.quantity || ''} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                            placeholder="500" />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Minimum Price (₹) *</label>
                        <input type="number" step="0.01" value={form.minimumPrice || ''} onChange={(e) => setForm({ ...form, minimumPrice: Number(e.target.value) })}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                            placeholder="45.00" />
                    </div>
                    <div style={{ gridColumn: '1/3' }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Location</label>
                        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                            placeholder="e.g. Nashik, Maharashtra" />
                    </div>
                    <div style={{ gridColumn: '1/3' }}>
                        <button type="submit" disabled={isSubmitting} style={{
                            padding: '12px 32px', background: '#16a34a', color: '#fff',
                            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                        }}>
                            {isSubmitting ? 'Creating...' : 'Create Bulk Product'}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <RiLoader4Line className="animate-spin" size={36} style={{ color: '#16a34a' }} />
                </div>
            ) : myProducts.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: 60, background: '#f8fafc',
                    borderRadius: 16, border: '1px solid #e2e8f0',
                }}>
                    <p style={{ color: '#64748b' }}>No bulk products yet. Click "Add Bulk Product" to create one.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {myProducts.map((p) => (
                        <div key={p.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '16px 20px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: 64, height: 64, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <RiLoader4Line size={24} color="#94a3b8" />
                                    </div>
                                )}
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{p.name}</h3>
                                    <p style={{ fontSize: 13, color: '#64748b' }}>
                                        {p.quantity} units • Min ₹{p.minimumPrice} • {p.location || 'No location'}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{
                                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                    background: p.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                                    color: p.status === 'ACTIVE' ? '#16a34a' : '#ef4444',
                                }}>
                                    {p.status}
                                </span>
                                <button onClick={() => handleDelete(p.id)} style={{
                                    background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8,
                                }}>
                                    <RiDeleteBinLine size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
