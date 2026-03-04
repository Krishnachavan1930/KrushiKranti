import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, UserCircle, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { logout } from '../../modules/auth/authSlice';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export function UserMenu() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        toast.success(t('common.logout_success') || 'Logged out successfully');
        navigate('/');
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin': return '/admin/dashboard';
            case 'farmer': return '/farmer/dashboard';
            case 'wholesaler': return '/wholesaler/dashboard';
            default: return '/dashboard';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-lg transition-none"
            >
                <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs uppercase">
                    {user?.name.charAt(0)}
                </div>
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-[100]">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate capitalize">{user?.role}</p>
                    </div>

                    <div className="py-1">
                        <Link
                            to={getDashboardLink()}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800 transition-none"
                        >
                            <LayoutDashboard size={14} />
                            {t('nav.control_panel')}
                        </Link>
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800 transition-none"
                        >
                            <UserCircle size={14} />
                            {t('nav.public_profile')}
                        </Link>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-600 font-medium active:bg-red-50 dark:active:bg-red-900/10 transition-none"
                        >
                            <LogOut size={14} />
                            {t('nav.sign_out')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
