import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { fetchMessages, sendMessage, fetchDeals, createDeal, respondDeal, clearMessages, fetchConversations } from '../negotiationSlice';
import { stompService } from '../../../services/stompService';
import { RiLoader4Line, RiSendPlaneFill, RiArrowLeftLine, RiHandCoinLine, RiAttachment2, RiCheckLine, RiCheckDoubleLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import ImageUpload from '../../../shared/components/ImageUpload';
import api from '../../../services/api';

interface NegotiationChatPageProps {
    readOnly?: boolean;
}

export function NegotiationChatPage({ readOnly = false }: NegotiationChatPageProps) {
    const { conversationId } = useParams<{ conversationId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { messages, deals, conversations, isLoading, isSubmitting } = useAppSelector((state) => state.negotiation);
    const { user } = useAppSelector((state) => state.auth);
    const [messageText, setMessageText] = useState('');
    const [showDealForm, setShowDealForm] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);
    const [dealForm, setDealForm] = useState({ pricePerUnit: 0, quantity: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const convId = Number(conversationId);

    useEffect(() => {
        dispatch(fetchConversations());
        if (!convId) return;

        dispatch(fetchMessages(convId));
        dispatch(fetchDeals(convId));

        // Connect STOMP and subscribe
        const connectAndSubscribe = async () => {
            try {
                if (!stompService.isConnected) {
                    await stompService.connect();
                }
                stompService.subscribeToConversation(convId);
            } catch (err) {
                console.error('STOMP connection failed:', err);
            }
        };
        connectAndSubscribe();

        return () => {
            stompService.unsubscribeFromConversation(convId);
            dispatch(clearMessages());
        };
    }, [convId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!messageText.trim() || readOnly) return;
        try {
            await dispatch(sendMessage({ conversationId: convId, message: messageText, messageType: 'TEXT' })).unwrap();
            setMessageText('');
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    const handleAttachmentUpload = async (res: any) => {
        if (readOnly) return;
        try {
            await dispatch(sendMessage({ conversationId: convId, message: res.url, messageType: 'ATTACHMENT' })).unwrap();
            toast.success('Attachment sent');
            setShowAttachment(false);
        } catch (err) {
            toast.error('Failed to send attachment');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCreateDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dealForm.pricePerUnit || !dealForm.quantity) {
            toast.error('Enter price and quantity');
            return;
        }
        try {
            await dispatch(createDeal({ conversationId: convId, ...dealForm })).unwrap();
            toast.success('Deal offer sent!');
            setShowDealForm(false);
            setDealForm({ pricePerUnit: 0, quantity: 0 });
        } catch (err) {
            toast.error('Failed to create deal');
        }
    };

    const handleRespondDeal = async (dealOfferId: number, action: 'ACCEPT' | 'REJECT') => {
        try {
            await dispatch(respondDeal({ dealOfferId, action })).unwrap();
            toast.success(action === 'ACCEPT' ? 'Deal accepted! 🎉' : 'Deal rejected');
            dispatch(fetchDeals(convId));
        } catch (err: any) {
            toast.error(err?.message || 'Failed to respond to deal');
        }
    };

    const handlePayNow = async (dealOfferId: number) => {
        try {
            const response = await api.post(`/bulk-payments/initiate/${dealOfferId}`);
            const paymentOrder = response.data.data;
            
            // Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                name: 'KrushiKranti',
                description: 'Bulk Order Payment',
                order_id: paymentOrder.id,
                handler: async function (razorpayResponse: any) {
                    try {
                        await api.post('/bulk-payments/verify', {
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature,
                        });
                        toast.success('Payment successful! Order confirmed.');
                        dispatch(fetchDeals(convId));
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#16a34a',
                },
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to initiate payment');
        }
    };

    const goBack = () => {
        if (user?.role === 'farmer') navigate('/farmer/negotiations');
        else if (user?.role === 'wholesaler') navigate('/wholesaler/negotiations');
        else if (user?.role === 'admin') navigate('/admin/negotiations');
        else navigate(-1);
    };

    const formatTime = (ts: string) => {
        try {
            return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    // Determine chat base path based on role
    const chatBasePath = user?.role === 'farmer' ? '/farmer/chat' :
        user?.role === 'wholesaler' ? '/wholesaler/chat' :
            '/admin/chat';

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            {/* Left Sidebar - Conversation List */}
            <div style={{ width: 320, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Chats</h2>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                            No active conversations
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const isActive = convId === conv.id;
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => navigate(`${chatBasePath}/${conv.id}`)}
                                    style={{
                                        padding: '16px 20px',
                                        borderBottom: '1px solid #e2e8f0',
                                        background: isActive ? '#f1f5f9' : '#fff',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        borderLeft: isActive ? '4px solid #16a34a' : '4px solid transparent'
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = '#fff'; }}
                                >
                                    <h3 style={{ fontSize: 15, fontWeight: isActive ? 700 : 600, color: '#1a1a2e', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {conv.bulkProductName}
                                    </h3>
                                    <p style={{ fontSize: 13, color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {user?.role === 'farmer' ? conv.wholesalerName : conv.farmerName}
                                    </p>
                                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0 0' }}>
                                        {formatTime(conv.createdAt)}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Side - Active Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#e5ddd5' }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                    background: '#f0f2f5', borderBottom: '1px solid #d1d5db',
                }}>
                    <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                        <RiArrowLeftLine size={20} color="#54656f" />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#cbd5e1', flexShrink: 0 }} />
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111b21', margin: 0 }}>
                                Negotiation Chat {readOnly && <span style={{ color: '#667781', fontWeight: 400, fontSize: 13 }}>— Read Only</span>}
                            </h2>
                            <p style={{ fontSize: 13, color: '#667781', margin: 0 }}>Conv #{convId}</p>
                        </div>
                    </div>
                    {!readOnly && (
                        <button onClick={() => setShowDealForm(!showDealForm)} style={{
                            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px', background: '#f59e0b', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>
                            <RiHandCoinLine /> Make Offer
                        </button>
                    )}
                </div>

                {/* Deal Form */}
                {showDealForm && !readOnly && (
                    <form onSubmit={handleCreateDeal} style={{
                        padding: 16, background: '#fffbeb', borderBottom: '1px solid #fde68a',
                        display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap',
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>₹ Per Unit</label>
                            <input type="number" step="0.01" value={dealForm.pricePerUnit || ''} onChange={(e) => setDealForm({ ...dealForm, pricePerUnit: Number(e.target.value) })}
                                style={{ padding: '8px 12px', border: '1px solid #fde68a', borderRadius: 6, fontSize: 14, width: 120 }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Quantity</label>
                            <input type="number" value={dealForm.quantity || ''} onChange={(e) => setDealForm({ ...dealForm, quantity: Number(e.target.value) })}
                                style={{ padding: '8px 12px', border: '1px solid #fde68a', borderRadius: 6, fontSize: 14, width: 120 }} />
                        </div>
                        <div style={{ fontSize: 14, color: '#92400e', fontWeight: 600 }}>
                            Total: ₹{(dealForm.pricePerUnit * dealForm.quantity).toFixed(2)}
                        </div>
                        <button type="submit" disabled={isSubmitting} style={{
                            padding: '8px 20px', background: '#f59e0b', color: '#fff',
                            border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>
                            Send Offer
                        </button>
                    </form>
                )}

                {/* Active Deals */}
                {deals.filter((d) => d.status === 'PENDING' || d.status === 'ACCEPTED').length > 0 && (
                    <div style={{ padding: '12px 20px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                        {deals.filter((d) => d.status === 'PENDING' || d.status === 'ACCEPTED').map((deal) => {
                            const isMyOffer = deal.createdById === Number(user?.id);
                            const canRespond = !isMyOffer && deal.status === 'PENDING';
                            const isAccepted = deal.status === 'ACCEPTED';
                            const canPay = isAccepted && user?.role === 'wholesaler';

                            return (
                                <div key={deal.id} style={{
                                    background: '#fff', borderRadius: 10, border: isAccepted ? '2px solid #22c55e' : '1px solid #86efac',
                                    padding: 12, marginBottom: 8,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: isAccepted ? '#15803d' : '#166534' }}>
                                                💰 {isAccepted ? 'Accepted Deal' : 'Deal Offer'}: ₹{deal.pricePerUnit}/unit × {deal.quantity} = ₹{deal.totalPrice}
                                            </p>
                                            <p style={{ fontSize: 12, color: '#64748b' }}>
                                                Offered by: <strong>{deal.createdByName}</strong> • Status: {deal.status}
                                            </p>
                                        </div>
                                        {!readOnly && (
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {canRespond && (
                                                    <>
                                                        <button onClick={() => handleRespondDeal(deal.id, 'ACCEPT')} style={{
                                                            padding: '6px 14px', background: '#16a34a', color: '#fff',
                                                            border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                                        }}>Accept</button>
                                                        <button onClick={() => handleRespondDeal(deal.id, 'REJECT')} style={{
                                                            padding: '6px 14px', background: '#ef4444', color: '#fff',
                                                            border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                                        }}>Reject</button>
                                                    </>
                                                )}
                                                {canPay && (
                                                    <button onClick={() => handlePayNow(deal.id)} style={{
                                                        padding: '8px 20px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff',
                                                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                        boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                                                    }}>💳 Pay Now</button>
                                                )}
                                                {isMyOffer && deal.status === 'PENDING' && (
                                                    <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Waiting for response...</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{
                    flex: 1, overflowY: 'auto', padding: '24px',
                    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '400px',
                    opacity: 0.95
                }}>

                    {/* Attachment Upload area */}
                    {showAttachment && !readOnly && (
                        <div style={{ marginBottom: 16, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h4 style={{ margin: 0, fontSize: 14, color: '#111b21' }}>Send Image</h4>
                                <button onClick={() => setShowAttachment(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#667781' }}>✕</button>
                            </div>
                            <ImageUpload
                                onUploadSuccess={handleAttachmentUpload}
                                onUploadError={(err) => toast.error(err.message)}
                            />
                        </div>
                    )}

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <RiLoader4Line className="animate-spin" size={32} style={{ color: '#16a34a' }} />
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.senderId === Number(user?.id);
                            const isDeal = msg.messageType === 'PRICE_OFFER';
                            const isAccepted = msg.messageType === 'DEAL_ACCEPTED';
                            const isRejected = msg.messageType === 'DEAL_REJECTED';

                            return (
                                <div key={msg.id} style={{
                                    display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start',
                                    marginBottom: 12, width: '100%'
                                }}>
                                    <div style={{
                                        maxWidth: '65%',
                                        position: 'relative',
                                        background: isDeal ? '#fffbeb' : isAccepted ? '#dcf8c6' : isRejected ? '#ffebee' :
                                            isMine ? '#dcf8c6' : '#ffffff',
                                        color: '#111b21',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        borderTopLeftRadius: isMine ? '8px' : '0px',
                                        borderTopRightRadius: isMine ? '0px' : '8px',
                                        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                                    }}>
                                        {/* Sender Name for Deals/System messages */}
                                        <p style={{ fontSize: 12, fontWeight: 700, color: isMine ? '#075e54' : '#128C7E', marginBottom: 4, margin: '0 0 4px 0' }}>
                                            {msg.senderName}
                                        </p>

                                        {msg.messageType === 'ATTACHMENT' ? (
                                            <div style={{ margin: '4px 0 8px 0', borderRadius: 8, overflow: 'hidden' }}>
                                                <a href={msg.message} target="_blank" rel="noopener noreferrer">
                                                    <img src={msg.message} alt="attachment" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', background: '#e2e8f0', display: 'block' }} />
                                                </a>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: 14.5, lineHeight: 1.4, margin: 0, paddingRight: 40, wordWrap: 'break-word' }}>
                                                {msg.message}
                                            </p>
                                        )}

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: -10, float: 'right' }}>
                                            <span style={{ fontSize: 11, color: '#667781' }}>
                                                {formatTime(msg.createdAt)}
                                            </span>
                                            {/* Message status ticks */}
                                            {isMine && (
                                                <span style={{ color: msg.status === 'SEEN' ? '#53bdeb' : '#8696a0', fontSize: 14, display: 'flex' }}>
                                                    {msg.status === 'SENT' ? <RiCheckLine /> : <RiCheckDoubleLine />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input WhatsApp Style */}
                {!readOnly && (
                    <div style={{
                        display: 'flex', gap: 12, padding: '10px 16px',
                        background: '#f0f2f5', alignItems: 'center'
                    }}>
                        <button
                            onClick={() => setShowAttachment(!showAttachment)}
                            style={{ background: 'none', border: 'none', color: '#54656f', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <RiAttachment2 size={24} />
                        </button>

                        <div style={{ flex: 1, background: '#fff', borderRadius: 24, display: 'flex', padding: '10px 16px', alignItems: 'center', gap: 12 }}>
                            <input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message"
                                style={{
                                    flex: 1, border: 'none', background: 'transparent',
                                    fontSize: 15, outline: 'none', color: '#111b21'
                                }}
                            />
                        </div>

                        <button onClick={handleSend} disabled={isSubmitting || !messageText.trim()} style={{
                            width: 48, height: 48, borderRadius: '50%', background: '#00a884', color: '#fff',
                            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: messageText.trim() ? 1 : 0.6, transition: 'opacity 0.2s', flexShrink: 0
                        }}>
                            <RiSendPlaneFill size={22} style={{ marginLeft: 3 }} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
