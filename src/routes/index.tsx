import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "../layouts";
import { AdminLayout } from "../layouts/AdminLayout";
import { FarmerLayout } from "../layouts/FarmerLayout";
import { WholesalerLayout } from "../layouts/WholesalerLayout";
import { UserLayout } from "../layouts/UserLayout";
import { ProtectedRoute } from "../modules/auth/components";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const UnauthorizedPage = lazy(() =>
  import("./pages/UnauthorizedPage").then((m) => ({
    default: m.UnauthorizedPage,
  })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const ErrorPage = lazy(() =>
  import("./pages/ErrorPage").then((m) => ({ default: m.ErrorPage })),
);
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);

const LoginPage = lazy(() =>
  import("../modules/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("../modules/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);
const RoleSelectionPage = lazy(() =>
  import("../modules/auth/pages/RoleSelectionPage").then((m) => ({
    default: m.RoleSelectionPage,
  })),
);

const ProductListPage = lazy(() =>
  import("../modules/product/pages/ProductListPage").then((m) => ({
    default: m.ProductListPage,
  })),
);
const ProductDetailPage = lazy(() =>
  import("../modules/product/pages/ProductDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  })),
);

const CartPage = lazy(() =>
  import("../modules/cart/pages/CartPage").then((m) => ({
    default: m.CartPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("../modules/cart/pages/CheckoutPage").then((m) => ({
    default: m.CheckoutPage,
  })),
);

const MyOrdersPage = lazy(() =>
  import("../modules/orders/pages/MyOrdersPage").then((m) => ({
    default: m.MyOrdersPage,
  })),
);
const WishlistPage = lazy(() =>
  import("../modules/wishlist/pages/WishlistPage").then((m) => ({
    default: m.WishlistPage,
  }))
);
const DeliveryTrackingPage = lazy(() =>
  import("../modules/orders/pages/DeliveryTrackingPage").then((m) => ({
    default: m.DeliveryTrackingPage,
  }))
);

const FarmerDashboardPage = lazy(() =>
  import("../modules/farmer/pages/FarmerDashboardPage").then((m) => ({
    default: m.FarmerDashboardPage,
  })),
);
const FarmerProductsPage = lazy(() =>
  import("../modules/farmer/pages/FarmerProductsPage").then((m) => ({
    default: m.FarmerProductsPage,
  })),
);
const AddProductPage = lazy(() =>
  import("../modules/farmer/pages/AddProductPage").then((m) => ({
    default: m.AddProductPage,
  })),
);
const EditProductPage = lazy(() =>
  import("../modules/farmer/pages/EditProductPage").then((m) => ({
    default: m.EditProductPage,
  })),
);

const WholesalerDashboardPage = lazy(() =>
  import("../modules/wholesaler/pages/WholesalerDashboardPage").then((m) => ({
    default: m.WholesalerDashboardPage,
  })),
);
const BulkRequestsPage = lazy(() =>
  import("../modules/wholesaler/pages/BulkRequestsPage").then((m) => ({
    default: m.BulkRequestsPage,
  })),
);
const InventoryPage = lazy(() =>
  import("../modules/wholesaler/pages/InventoryPage").then((m) => ({
    default: m.InventoryPage,
  })),
);

const AdminDashboardPage = lazy(() =>
  import("../modules/admin/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const ManageUsersPage = lazy(() =>
  import("../modules/admin/pages/ManageUsersPage").then((m) => ({
    default: m.ManageUsersPage,
  })),
);
const ManageProductsPage = lazy(() =>
  import("../modules/admin/pages/ManageProductsPage").then((m) => ({
    default: m.ManageProductsPage,
  })),
);
const FraudDetectionPage = lazy(() =>
  import("../modules/admin/pages/FraudDetectionPage").then((m) => ({
    default: m.FraudDetectionPage,
  })),
);
const CommissionPage = lazy(() =>
  import("../modules/admin/pages/CommissionPage").then((m) => ({
    default: m.CommissionPage,
  })),
);
const AdminLogsPage = lazy(() =>
  import("../modules/admin/pages/AdminLogsPage").then((m) => ({
    default: m.AdminLogsPage,
  })),
);

const ChatPage = lazy(() =>
  import("../modules/chat/pages/ChatPage").then((m) => ({
    default: m.ChatPage,
  })),
);
const ReadOnlyChatPage = lazy(() =>
  import("../modules/chat/pages/ChatPage").then((m) => ({
    default: () => <m.ChatPage readOnly={true} />,
  })),
);

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-bg dark:bg-gray-900">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: (
      <SuspenseWrapper>
        <ErrorPage />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <ProductListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/:id",
        element: (
          <SuspenseWrapper>
            <ProductDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile/:id",
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "cart",
        element: (
          <SuspenseWrapper>
            <CartPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "auth/role-selection",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <RoleSelectionPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "unauthorized",
        element: (
          <SuspenseWrapper>
            <UnauthorizedPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <SuspenseWrapper>
            <AboutPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "contact",
        element: (
          <SuspenseWrapper>
            <ContactPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // ── User (consumer) protected routes ──────────────────────────────────────
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <ErrorPage />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "orders",
        element: (
          <SuspenseWrapper>
            <MyOrdersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "orders/:id/track",
        element: (
          <SuspenseWrapper>
            <DeliveryTrackingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "wishlist",
        element: (
          <SuspenseWrapper>
            <WishlistPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "chat",
        element: (
          <SuspenseWrapper>
            <ChatPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "checkout",
        element: (
          <SuspenseWrapper>
            <CheckoutPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // ── Farmer protected routes ────────────────────────────────────────────────
  {
    path: "/farmer",
    element: (
      <ProtectedRoute allowedRoles={["farmer"]}>
        <FarmerLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <ErrorPage />
      </SuspenseWrapper>
    ),
    children: [
      { path: "", element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <FarmerDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <FarmerProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/add",
        element: (
          <SuspenseWrapper>
            <AddProductPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/edit/:id",
        element: (
          <SuspenseWrapper>
            <EditProductPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "orders",
        element: (
          <SuspenseWrapper>
            <MyOrdersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "chat",
        element: (
          <SuspenseWrapper>
            <ChatPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // ── Wholesaler protected routes ────────────────────────────────────────────
  {
    path: "/wholesaler",
    element: (
      <ProtectedRoute allowedRoles={["wholesaler"]}>
        <WholesalerLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <ErrorPage />
      </SuspenseWrapper>
    ),
    children: [
      { path: "", element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <WholesalerDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "bulk-requests",
        element: (
          <SuspenseWrapper>
            <BulkRequestsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "inventory",
        element: (
          <SuspenseWrapper>
            <InventoryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "chat",
        element: (
          <SuspenseWrapper>
            <ChatPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // ── Admin protected routes ─────────────────────────────────────────────────
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <ErrorPage />
      </SuspenseWrapper>
    ),
    children: [
      { path: "", element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "users",
        element: (
          <SuspenseWrapper>
            <ManageUsersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <ManageProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "fraud",
        element: (
          <SuspenseWrapper>
            <FraudDetectionPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "commissions",
        element: (
          <SuspenseWrapper>
            <CommissionPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "logs",
        element: (
          <SuspenseWrapper>
            <AdminLogsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "chat",
        element: (
          <SuspenseWrapper>
            <ReadOnlyChatPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // ── Auth routes ────────────────────────────────────────────────────────────
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  // ── Catch-all route ────────────────────────────────────────────────────────
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
