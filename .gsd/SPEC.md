# Specification: KrushiKranti 2.0 Frontend

## 1. Goal
Complete the frontend implementation of KrushiKranti 2.0, ensuring all features in the PRD are functional, responsive, and follow the defined design system.

## 2. Core Requirements

### 2.1 Wishlist Module
- **Features:** Add/Remove from wishlist, Wishlist page, persistence in localStorage.

### 2.2 Reviews & Ratings
- **System:** 1-5 star rating system.
- **Display:** Average rating and user reviews on product pages.
- **Interaction:** Add review form for authenticated users.

### 2.3 Order Enhancements
- **Filtering:** Filter order history by status (Pending, Delivered, Cancelled).
- **Pagination:** Implement pagination for order history.
- **Cancellation:** Order cancellation flow with confirmation modal.
- **Refund:** Refund request UI (mock logic).

### 2.5 Admin Enterprise Features
- **Fraud Detection:** UI simulation for flagging suspicious pricing and abnormal activity.
- **Commission Tracking:** Detailed tracking of platform earnings with revenue charts.
- **Export Data:** CSV export functionality for users and orders.
- **Advanced Analytics:** Dynamic charts for city-wise sales, top performers, and order heatmaps.
- **System Logs:** Comprehensive admin activity logs with date filtering.

### 2.6 Technical Requirements (Global)
- **State Management:** use Redux Toolkit for all data flow.
- **Charts:** Use Recharts for all visualizations.
- **UI:** Consistent dark mode, Framer Motion animations, and Tailwind CSS.
- **Security:** Protected routes and role-based access.

### 2.3 UX/UI Improvements
- **Animated Transitions:** Enhance page transitions and component animations using Framer Motion.
- **Loading States:** Add shimmer/skeleton loaders for all data-fetching components.
- **Dark Mode:** Ensure full compatibility and accessibility in dark mode.
- **Responsive Design:** Verify and fix any responsive issues on mobile and tablet.

## 3. Tech Stack Compliance
- React 19 (Vite)
- Tailwind CSS 4
- Redux Toolkit (RTK)
- Framer Motion
- Socket.io-client
- React Hook Form + Zod
- Lucide React

## 4. Acceptance Criteria
- [ ] All pages listed in PRD are accessible and functional.
- [ ] Role-based access control works for all protected routes.
- [ ] Real-time chat works with online/typing indicators.
- [ ] Checkout completes with a successful (mock) payment.
- [ ] Invoices can be downloaded as PDFs.
- [ ] Dashboards show accurate (mock) data with charts.
- [ ] Light/Dark mode transitions are smooth.
- [ ] Responsive design works on all screen sizes.
