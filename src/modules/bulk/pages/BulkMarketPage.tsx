import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchBulkProducts } from '../bulkSlice';
import { startNegotiation } from '../negotiationSlice';
import { RiLoader4Line, RiMapPinLine, RiScalesLine, RiPriceTag3Line } from 'react-icons/ri';
import toast from 'react-hot-toast';

export function BulkMarketPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { products, isLoading } = useAppSelector((state) => state.bulk);
    const { user } = useAppSelector((state) => state.auth);
    const { isSubmitting } = useAppSelector((state) => state.negotiation);

    useEffect(() => {
        dispatch(fetchBulkProducts());
    }, [dispatch]);

    const handleNegotiate = async (bulkProductId: number) => {
        if (!user) {
            toast.error('Please login to negotiate');
            navigate('/login');
            return;
        }
        if (user.role !== 'wholesaler') {
            toast.error('Only wholesalers can negotiate bulk deals');
            return;
        }
        try {
            const result = await dispatch(startNegotiation(bulkProductId)).unwrap();
            navigate(`/wholesaler/chat/${result.id}`);
        } catch (err) {
            toast.error((err as string) || 'Failed to start negotiation');
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
                    🌾 Bulk Marketplace
                </h1>
                <p style={{ color: '#64748b', fontSize: 15 }}>
                    Browse bulk agricultural products from verified farmers. Negotiate directly for the best deals.
                </p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                    <RiLoader4Line className="animate-spin" size={40} style={{ color: '#16a34a', margin: '0 auto' }} />
                </div>
            ) : products.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: 80, background: '#f8fafc',
                    borderRadius: 16, border: '1px solid #e2e8f0'
                }}>
                    <RiScalesLine size={48} style={{ color: '#94a3b8', margin: '0 auto 16px' }} />
                    <p style={{ color: '#64748b', fontSize: 16 }}>No bulk products available right now</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 24,
                }}>
                    {products.map((product) => (
                        <div key={product.id} style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
                            padding: 24, transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {product.imageUrl ? (
                                <div style={{ margin: '-24px -24px 20px -24px', height: 160, overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <div style={{ margin: '-24px -24px 20px -24px', height: 160, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px 16px 0 0' }}>
                                    <RiLoader4Line size={32} color="#cbd5e1" />
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
                                        {product.name}
                                    </h3>
                                    <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 500 }}>
                                        by {product.farmerName}
                                    </p>
                                </div>
                                <span style={{
                                    background: '#f0fdf4', color: '#16a34a', padding: '4px 12px',
                                    borderRadius: 20, fontSize: 12, fontWeight: 600,
                                }}>
                                    {product.status}
                                </span>
                            </div>

                            {product.description && (
                                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                                    {product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}
                                </p>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <RiScalesLine size={16} style={{ color: '#64748b' }} />
                                    <span style={{ fontSize: 14, color: '#334155' }}>
                                        <strong>{product.quantity}</strong> units available
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <RiPriceTag3Line size={16} style={{ color: '#64748b' }} />
                                    <span style={{ fontSize: 14, color: '#334155' }}>
                                        Min. Price: <strong>₹{product.minimumPrice}</strong>
                                    </span>
                                </div>
                                {product.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <RiMapPinLine size={16} style={{ color: '#64748b' }} />
                                        <span style={{ fontSize: 14, color: '#334155' }}>{product.location}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleNegotiate(product.id)}
                                disabled={isSubmitting || !user || user.role !== 'wholesaler'}
                                style={{
                                    width: '100%', padding: '12px 20px',
                                    background: user?.role === 'wholesaler' ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#e2e8f0',
                                    color: user?.role === 'wholesaler' ? '#fff' : '#94a3b8',
                                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                                    cursor: user?.role === 'wholesaler' ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {isSubmitting ? 'Starting...' : '💬 Negotiate Price'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
