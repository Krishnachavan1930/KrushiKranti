import { useState } from 'react';
import {
    User, Mail, Phone, MapPin, Shield, Calendar,
    Pencil, Check, X, ShoppingBag, Heart, MessageSquare,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { setUser } from '../../modules/auth/authSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ─── helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    } catch {
        return 'January 2024';
    }
}

function roleBadgeColor(role: string) {
    const map: Record<string, string> = {
        farmer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        wholesaler: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[role] || 'bg-slate-100 text-slate-600';
}

// ─── inner components ─────────────────────────────────────────────────────────
interface FieldRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    editable: boolean;
    editMode: boolean;
    inputValue: string;
    type?: string;
    onEdit: () => void;
    onChange: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
    placeholder?: string;
}

function FieldRow({
    icon, label, value, editable, editMode,
    inputValue, type = 'text', onEdit, onChange, onSave, onCancel, placeholder,
}: FieldRowProps) {
    return (
        <div className="flex items-start gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                {editMode ? (
                    <div className="flex items-center gap-2">
                        <input
                            type={type}
                            value={inputValue}
                            onChange={e => onChange(e.target.value)}
                            placeholder={placeholder || label}
                            autoFocus
                            className="flex-1 px-3 py-1.5 text-sm border border-green-400 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-400/30"
                        />
                        <button
                            onClick={onSave}
                            className="p-1.5 bg-green-600 text-white rounded-lg"
                            title="Save"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={onCancel}
                            className="p-1.5 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg"
                            title="Cancel"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">
                            {value || <span className="text-slate-400 font-normal italic">Not provided</span>}
                        </p>
                        {editable && (
                            <button
                                onClick={onEdit}
                                className="ml-3 p-1.5 text-slate-400 rounded-lg flex-shrink-0"
                                title={`Edit ${label}`}
                            >
                                <Pencil size={13} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── main page ────────────────────────────────────────────────────────────────
export function ProfilePage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const wishlistCount = useAppSelector(state => state.wishlist.items.length);
    const cartCount = useAppSelector(state => state.cart.items.length);

    // which field is in edit mode
    const [editing, setEditing] = useState<string | null>(null);

    // local draft values
    const [draft, setDraft] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    // password change section
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [savingPwd, setSavingPwd] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-gray-950">
                <p className="text-slate-500">Please log in to view your profile.</p>
            </div>
        );
    }

    // ── field save ──────────────────────────────────────────────────────────────
    const saveField = (field: keyof typeof draft) => {
        const updated = { ...user, [field]: draft[field] };
        dispatch(setUser(updated));
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
        setEditing(null);
    };

    const cancelField = (field: keyof typeof draft) => {
        setDraft(prev => ({ ...prev, [field]: (user as Record<string, string>)[field] || '' }));
        setEditing(null);
    };

    // ── password save (mock) ──────────────────────────────────────────────────
    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwords.current) { toast.error('Enter your current password'); return; }
        if (passwords.next.length < 6) { toast.error('New password must be at least 6 characters'); return; }
        if (passwords.next !== passwords.confirm) { toast.error('Passwords do not match'); return; }
        setSavingPwd(true);
        setTimeout(() => {
            setSavingPwd(false);
            setPasswords({ current: '', next: '', confirm: '' });
            setShowPasswordForm(false);
            toast.success('Password changed successfully');
        }, 1000);
    };

    const initials = user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
            {/* ── Page header ──────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                    <p className="text-sm text-slate-500 mt-0.5">View and manage your personal information</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
                {/* ── Top row: avatar card + stats ─────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Avatar card */}
                    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-extrabold text-2xl mb-3">
                            {initials}
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h2>
                        <p className="text-xs text-slate-500 mb-3">{user.email}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${roleBadgeColor(user.role)}`}>
                            {user.role}
                        </span>

                        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 w-full space-y-2 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <Calendar size={13} className="flex-shrink-0" />
                                <span>Joined {formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Wishlist Items', value: wishlistCount, icon: <Heart size={18} className="text-red-500" />, to: '/wishlist' },
                            { label: 'Cart Items', value: cartCount, icon: <ShoppingBag size={18} className="text-green-600" />, to: '/cart' },
                            { label: 'Messages', value: 0, icon: <MessageSquare size={18} className="text-blue-500" />, to: '/chat' },
                        ].map(stat => (
                            <Link
                                key={stat.label}
                                to={stat.to}
                                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3"
                            >
                                <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Personal Information ──────────────────────────────────────── */}
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click the edit icon next to any field to update it</p>
                    </div>
                    <div className="px-6">
                        <FieldRow
                            icon={<User size={16} />}
                            label="Full Name"
                            value={user.name}
                            editable
                            editMode={editing === 'name'}
                            inputValue={draft.name}
                            onEdit={() => { setDraft(p => ({ ...p, name: user.name })); setEditing('name'); }}
                            onChange={v => setDraft(p => ({ ...p, name: v }))}
                            onSave={() => saveField('name')}
                            onCancel={() => cancelField('name')}
                            placeholder="Enter your full name"
                        />
                        <FieldRow
                            icon={<Mail size={16} />}
                            label="Email Address"
                            value={user.email}
                            editable={false}
                            editMode={false}
                            inputValue={user.email}
                            onEdit={() => { }}
                            onChange={() => { }}
                            onSave={() => { }}
                            onCancel={() => { }}
                        />
                        <FieldRow
                            icon={<Phone size={16} />}
                            label="Phone Number"
                            value={user.phone || ''}
                            editable
                            editMode={editing === 'phone'}
                            inputValue={draft.phone}
                            type="tel"
                            onEdit={() => { setDraft(p => ({ ...p, phone: user.phone || '' })); setEditing('phone'); }}
                            onChange={v => setDraft(p => ({ ...p, phone: v }))}
                            onSave={() => saveField('phone')}
                            onCancel={() => cancelField('phone')}
                            placeholder="+91 9876543210"
                        />
                        <FieldRow
                            icon={<MapPin size={16} />}
                            label="Address"
                            value={user.address || ''}
                            editable
                            editMode={editing === 'address'}
                            inputValue={draft.address}
                            onEdit={() => { setDraft(p => ({ ...p, address: user.address || '' })); setEditing('address'); }}
                            onChange={v => setDraft(p => ({ ...p, address: v }))}
                            onSave={() => saveField('address')}
                            onCancel={() => cancelField('address')}
                            placeholder="City, State"
                        />
                    </div>
                </div>

                {/* ── Security ─────────────────────────────────────────────────── */}
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Manage your account password</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-green-600" />
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${roleBadgeColor(user.role)}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 py-4">
                        {!showPasswordForm ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Password</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Last changed: never</p>
                                </div>
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="px-4 py-2 text-xs font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800"
                                >
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                                {[
                                    { field: 'current', label: 'Current Password', key: 'current' as const },
                                    { field: 'next', label: 'New Password', key: 'next' as const },
                                    { field: 'confirm', label: 'Confirm New Password', key: 'confirm' as const },
                                ].map(({ label, key }) => (
                                    <div key={key}>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                            {label}
                                        </label>
                                        <input
                                            type="password"
                                            value={passwords[key]}
                                            onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                            placeholder="••••••••"
                                            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400"
                                        />
                                    </div>
                                ))}
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="submit"
                                        disabled={savingPwd}
                                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg disabled:opacity-60"
                                    >
                                        {savingPwd ? 'Saving...' : 'Save Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowPasswordForm(false); setPasswords({ current: '', next: '', confirm: '' }); }}
                                        className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* ── Danger zone ──────────────────────────────────────────────── */}
                <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 rounded-xl">
                    <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30">
                        <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Delete Account</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Permanently remove your account and all data. This cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={() => toast.error('Contact support to delete your account')}
                            className="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 dark:border-red-800 rounded-lg flex-shrink-0 ml-4"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
