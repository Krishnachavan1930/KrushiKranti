import {
    RiDashboardLine,
    RiUserLine,
    RiPlantLine,
    RiShieldLine,
    RiPercentLine,
    RiFileTextLine,
    RiMessage2Line,
} from 'react-icons/ri';
import { BaseDashboardLayout } from './BaseDashboardLayout';

export function AdminLayout() {
    const menuItems = [
        { to: '/admin/dashboard', label: 'Overview', icon: RiDashboardLine },
        { to: '/admin/users', label: 'Users', icon: RiUserLine },
        { to: '/admin/products', label: 'Products', icon: RiPlantLine },
        { to: '/admin/fraud', label: 'Fraud Alerts', icon: RiShieldLine },
        { to: '/admin/commissions', label: 'Commissions', icon: RiPercentLine },
        { to: '/admin/logs', label: 'Activity Logs', icon: RiFileTextLine },
        { to: '/admin/chat', label: 'Chat Monitor', icon: RiMessage2Line },
    ];

    return (
        <BaseDashboardLayout
            menuItems={menuItems}
            title="Admin Console"
            roleLabel="Administrator"
        />
    );
}
