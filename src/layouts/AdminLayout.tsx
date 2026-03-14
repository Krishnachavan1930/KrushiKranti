import {
  RiDashboardLine,
  RiUserLine,
  RiPlantLine,
  RiShieldLine,
  RiPercentLine,
  RiFileTextLine,
  RiMessage2Line,
  RiShoppingBagLine,
  RiArticleLine,
  RiBankCardLine,
  RiTruckLine,
} from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { BaseDashboardLayout } from "./BaseDashboardLayout";

export function AdminLayout() {
  const { t } = useTranslation();

  const menuItems = [
    {
      to: "/admin/dashboard",
      label: t("admin.nav.overview"),
      icon: RiDashboardLine,
    },
    { to: "/admin/orders", label: "Orders", icon: RiShoppingBagLine },
    { to: "/admin/users", label: t("admin.nav.users"), icon: RiUserLine },
    {
      to: "/admin/products",
      label: t("admin.nav.products"),
      icon: RiPlantLine,
    },
    { to: "/admin/blogs", label: "Blogs", icon: RiArticleLine },
    { to: "/admin/payments", label: "Payments", icon: RiBankCardLine },
    { to: "/admin/shipments", label: "Shipments", icon: RiTruckLine },
    { to: "/admin/fraud", label: t("admin.nav.fraud"), icon: RiShieldLine },
    {
      to: "/admin/commissions",
      label: t("admin.nav.commissions"),
      icon: RiPercentLine,
    },
    { to: "/admin/logs", label: t("admin.nav.logs"), icon: RiFileTextLine },
    { to: "/admin/negotiations", label: "Negotiations", icon: RiMessage2Line },
    { to: "/admin/chat", label: t("admin.nav.chat"), icon: RiMessage2Line },
    { to: "/admin/profile", label: "Profile", icon: FiUser },
  ];

  return (
    <BaseDashboardLayout
      menuItems={menuItems}
      title={t("layout.admin_console")}
      roleLabel={t("layout.admin_role")}
    />
  );
}
