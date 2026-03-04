import {
    RiDashboardLine,
    RiShoppingBagLine,
    RiHeartLine,
    RiUserLine,
    RiTruckLine,
} from 'react-icons/ri';
import { BaseDashboardLayout } from './BaseDashboardLayout';

export function UserLayout() {
    const menuItems = [
        { to: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
        { to: '/orders', label: 'My Orders', icon: RiShoppingBagLine },
        { to: '/orders/ORD-001/track', label: 'Track Delivery', icon: RiTruckLine },
        { to: '/wishlist', label: 'Wishlist', icon: RiHeartLine },
        { to: '/profile', label: 'Profile', icon: RiUserLine },
    ];

    return (
        <BaseDashboardLayout
            menuItems={menuItems}
            title="My Account"
            roleLabel="Customer"
        />
    );
}
