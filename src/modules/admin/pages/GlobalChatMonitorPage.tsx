import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchConversations } from '../../bulk/negotiationSlice';
import { useNavigate } from 'react-router-dom';
import { RiMessage2Line } from 'react-icons/ri';
import AdminLayout from '../components/AdminLayout';
import { formatTime } from '../../../utils/formatters';

const GlobalChatMonitorPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { conversations, isLoading } = useAppSelector((state) => state.negotiation);

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    return (
        <AdminLayout>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RiMessage2Line color="#16a34a" />
                        Global Chat Monitor
                    </h1>
                </div>

                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    {isLoading ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading conversations...</div>
                    ) : conversations.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                            No active negotiations found across the platform.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Product</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Farmer</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Wholesaler</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Started</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conversations.map((conv) => (
                                    <tr key={conv.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#1e293b' }}>
                                            {conv.bulkProductName}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748b' }}>
                                            {conv.farmerName}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748b' }}>
                                            {conv.wholesalerName}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                                background: conv.status === 'ACTIVE' ? '#dbeafe' : conv.status === 'AGREED' ? '#dcfce7' : '#fee2e2',
                                                color: conv.status === 'ACTIVE' ? '#2563eb' : conv.status === 'AGREED' ? '#16a34a' : '#dc2626'
                                            }}>
                                                {conv.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748b' }}>
                                            {formatTime(conv.createdAt)}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => navigate(`/admin/chat/${conv.id}`)}
                                                style={{ padding: '6px 14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#0f172a'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#1e293b'}
                                            >
                                                View Chat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default GlobalChatMonitorPage;
