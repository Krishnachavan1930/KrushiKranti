import {
    RiDashboardLine,
    RiUserLine,
    RiPlantLine,
    RiShieldLine,
    RiPercentLine,
    RiFileTextLine,
    RiMessage2Line,
} from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { BaseDashboardLayout } from './BaseDashboardLayout';

export function AdminLayout() {
    const { t } = useTranslation();

    const menuItems = [
        { to: '/admin/dashboard', label: t('admin.nav.overview'), icon: RiDashboardLine },
        { to: '/admin/users', label: t('admin.nav.users'), icon: RiUserLine },
        { to: '/admin/products', label: t('admin.nav.products'), icon: RiPlantLine },
        { to: '/admin/fraud', label: t('admin.nav.fraud'), icon: RiShieldLine },
        { to: '/admin/commissions', label: t('admin.nav.commissions'), icon: RiPercentLine },
        { to: '/admin/logs', label: t('admin.nav.logs'), icon: RiFileTextLine },
        { to: '/admin/chat', label: t('admin.nav.chat'), icon: RiMessage2Line },
    ];

    return (
        <BaseDashboardLayout
            menuItems={menuItems}
            title={t('layout.admin_console')}
            roleLabel={t('layout.admin_role')}
        />
    );
}
