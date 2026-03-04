import {
    RiDashboardLine,
    RiFileListLine,
    RiStoreLine,
    RiMessage2Line,
    RiUserLine,
    RiStarLine,
} from 'react-icons/ri';
import { BaseDashboardLayout } from './BaseDashboardLayout';

export function WholesalerLayout() {
    const menuItems = [
        { to: '/wholesaler/dashboard', label: 'Dashboard', icon: RiDashboardLine },
        { to: '/wholesaler/bulk-requests', label: 'Bulk Requests', icon: RiFileListLine },
        { to: '/wholesaler/inventory', label: 'Inventory', icon: RiStoreLine },
        { to: '/wholesaler/chat', label: 'Chat', icon: RiMessage2Line },
        { to: '/wholesaler/ratings', label: 'Supplier Ratings', icon: RiStarLine },
        { to: '/wholesaler/profile', label: 'Profile', icon: RiUserLine },
    ];

    return (
        <BaseDashboardLayout
            menuItems={menuItems}
            title="Wholesaler Portal"
            roleLabel="Wholesaler"
        />
    );
}
