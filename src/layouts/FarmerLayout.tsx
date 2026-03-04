import {
    RiDashboardLine,
    RiPlantLine,
    RiAddCircleLine,
    RiShoppingBagLine,
    RiBarChartLine,
    RiMessage2Line,
} from 'react-icons/ri';
import { BaseDashboardLayout } from './BaseDashboardLayout';

export function FarmerLayout() {
    const menuItems = [
        { to: '/farmer/dashboard', label: 'Dashboard', icon: RiDashboardLine },
        { to: '/farmer/products', label: 'My Products', icon: RiPlantLine },
        { to: '/farmer/products/add', label: 'Add Product', icon: RiAddCircleLine },
        { to: '/farmer/orders', label: 'Orders', icon: RiShoppingBagLine },
        { to: '/farmer/earnings', label: 'Revenue', icon: RiBarChartLine },
        { to: '/farmer/chat', label: 'Chat', icon: RiMessage2Line },
        { to: '/farmer/profile', label: 'Profile', icon: RiDashboardLine },
    ];

    return (
        <BaseDashboardLayout
            menuItems={menuItems}
            title="Farmer Portal"
            roleLabel="Farmer"
        />
    );
}
